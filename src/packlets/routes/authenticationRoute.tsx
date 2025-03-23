import { Elysia, t } from 'elysia'
import { Html } from '@elysiajs/html'
import appleSignIn from 'apple-signin-auth'

import { LoginPage } from '$components/LoginPage'
import { getCSRFToken, verifyCSRFToken } from '$utils/csrf'
import { collections } from '$utils/mongo'
import { getClientAddress } from '$utils/getClientAddress'
import { cookie } from '$model/cookie'
import { createUserSession, getUserSession } from '$utils/session'

const {
  APPLE_TEAM_ID = '',
  APPLE_PRIVATE_KEY = '',
  APPLE_KEY_ID = '',
} = process.env

const redirectUri = 'https://music-profile.rayriffy.com/callback'

export const authenticationRoute = new Elysia()
  .get(
    '/',
    ({ cookie, redirect }) => {
      if (cookie.token.value !== undefined) return redirect('/dashboard')

      const authorizationUrl = appleSignIn.getAuthorizationUrl({
        clientID: 'com.rayriffy.apple-music.auth',
        redirectUri,
        state: getCSRFToken(),
        responseMode: 'form_post',
        scope: 'email',
      })

      return <LoginPage authorizationUrl={authorizationUrl} />
    },
    {
      cookie,
    }
  )
  .post(
    '/callback',
    async ({ body, headers, cookie, redirect }) => {
      // validate csrf token
      const csrfVerified = verifyCSRFToken(body.state)

      if (!csrfVerified) throw new Error('request has been tampered')

      const clientSecret = appleSignIn.getClientSecret({
        clientID: 'com.rayriffy.apple-music.auth',
        teamID: APPLE_TEAM_ID,
        privateKey: APPLE_PRIVATE_KEY.replaceAll(/\\n/g, '\n'),
        keyIdentifier: APPLE_KEY_ID,
      })

      try {
        /**
         * Verify authentication code, and get authentication data
         */
        const tokenResponse = await appleSignIn.getAuthorizationToken(
          body.code,
          {
            clientID: 'com.rayriffy.apple-music.auth',
            redirectUri,
            clientSecret,
          }
        )

        const { sub: appleUserId, email: appleUserEmail } =
          await appleSignIn.verifyIdToken(tokenResponse.id_token, {
            audience: 'com.rayriffy.apple-music.auth',
            ignoreExpiration: true,
          })

        /**
         * Insert user OAuth result to database
         */
        const createdAt = new Date()
        const user = await collections.users.findOneAndUpdate(
          {
            uid: appleUserId,
          },
          {
            $setOnInsert: {
              uid: appleUserId,
              email: appleUserEmail,
              createdAt: createdAt,
            },
            $set: {
              'token.refresh': tokenResponse.refresh_token,
              clientAddress: getClientAddress(headers),
              updatedAt: createdAt,
            },
          },
          {
            upsert: true,
          }
        )

        /**
         * Generate encrypted token
         */
        const token = await createUserSession({
          id: appleUserId,
          email: appleUserEmail,
        })

        cookie.token.set({
          value: token,
          secure: true,
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60,
          expires: new Date(Date.now() + 60 * 60 * 1000),
        })

        return redirect(
          `/${typeof user?.token?.music !== 'string' ? 'connect' : 'dashboard'}`
        )
      } catch (e) {
        throw new Error('unable to verify authentication response from Apple')
      }
    },
    {
      body: t.Object({
        code: t.String(),
        state: t.String(),
      }),
      cookie,
    }
  )
  .get(
    '/logout',
    ({ cookie, redirect }) => {
      cookie.token.remove()

      return redirect('/')
    },
    {
      cookie,
    }
  )
  .post(
    '/connect',
    async ({ body: { userToken }, cookie, headers }) => {
      const session = await getUserSession(cookie.token.value)

      if (session === null) throw new Error(`unauthenticated`)

      const targetUser = await collections.users.findOne(
        {
          uid: session.id,
        },
        {
          projection: {
            token: {
              music: 1,
            },
          },
        }
      )

      if (!targetUser) throw new Error(`illegal user`)

      if (targetUser.token.music !== userToken)
        await collections.users.updateOne(
          {
            uid: session.id,
          },
          {
            $set: {
              'token.music': userToken,
              clientAddress: await getClientAddress(headers),
              updatedAt: new Date(),
            },
          }
        )

      return 'ok'
    },
    {
      body: t.Object({
        userToken: t.String(),
      }),
      cookie,
    }
  )
