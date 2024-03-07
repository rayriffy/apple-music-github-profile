import { NextResponse } from 'next/server'

import appleSignin from 'apple-signin-auth'
import CSRF from 'csrf'
import { serialize } from 'cookie'

import { collections } from '$context/mongo'
import { getClientAddress } from '$core/services/getClientAddress'
import { createUserSession } from '$core/services/session/createUserSession'
import { sessionCookieName } from '$core/constants/sessionCookieName'
import { redirectUri } from '$core/constants/redirectUri'

const {
  CSRF_SECRET = '',
  APPLE_TEAM_ID = '',
  APPLE_PRIVATE_KEY = '',
  APPLE_KEY_ID = '',
} = process.env

export const POST = async (request: Request) => {
  const formData = await request.formData()

  // parse values
  const state = formData.get('state') as string
  const code = formData.get('code') as string

  // verify csrf token
  const csrfInstance = new CSRF()
  const isCSRFVerified = csrfInstance.verify(CSRF_SECRET, state)

  if (!isCSRFVerified) {
    return NextResponse.json(
      {
        message: 'request has been tampered',
      },
      {
        status: 400,
      }
    )
  }

  // parse sign-in with apple
  const clientSecret = appleSignin.getClientSecret({
    clientID: 'com.rayriffy.apple-music.auth',
    teamID: APPLE_TEAM_ID,
    privateKey: APPLE_PRIVATE_KEY.replaceAll(/\\n/g, '\n'),
    keyIdentifier: APPLE_KEY_ID,
  })

  try {
    /**
     * Verify authentication code, and get authentication data
     */
    const tokenResponse = await appleSignin.getAuthorizationToken(code, {
      clientID: 'com.rayriffy.apple-music.auth',
      redirectUri,
      clientSecret,
    })

    const { sub: appleUserId, email: appleUserEmail } =
      await appleSignin.verifyIdToken(tokenResponse.id_token, {
        audience: 'com.rayriffy.apple-music.auth',
        ignoreExpiration: true,
      })

    /**
     * Insert user OAuth result to database
     */
    const createdAt = new Date()
    const user = await collections.users.findOneAndUpdate({
      uid: appleUserId
    }, {
      $setOnInsert: {
        uid: appleUserId,
        email: appleUserEmail,
        createdAt: createdAt,
      },
      $set: {
        'token.refresh': tokenResponse.refresh_token,
        clientAddress: getClientAddress(),
        updatedAt: createdAt,
      },
    }, {
      upsert: true
    })

    /**
     * Generate encrypted token
     */
    const enclavedToken = await createUserSession({
      id: appleUserId,
      email: appleUserEmail,
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
    })

    return new NextResponse(
      `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <meta http-equiv="Refresh" content="1; url=https://music-profile.rayriffy.com/${
            user!.token.music === null ? 'link' : 'dash'
          }" />
          <title>Authenticated</title>
          <style>
            p {
              font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
            }
          </style>
        </head>
        <body>
          <p>Authenticated! Redirecting...</p>
        </body>
      </html>
    `,
      {
        headers: {
          'Content-Type': 'text/html',
          'Set-Cookie': serialize(sessionCookieName, enclavedToken, {
            maxAge: 60 * 60,
            expires: new Date(Date.now() + 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
          }),
        },
      }
    )
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      {
        message: 'unable to verify authentication response from Apple',
      },
      {
        status: 500,
      }
    )
  }
}
