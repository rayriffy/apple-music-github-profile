import type { NextApiHandler } from 'next'

import { PrismaClient } from '@prisma/client'
import appleSignin from 'apple-signin-auth'
import CSRF from 'csrf'

import { cookie } from '../../../core/services/cookie'
import { sessionCookieName } from '../../../core/constants/sessionCookieName'
import { createUserSession } from '../../../core/services/session/createUserSession'

interface CallbackRequest {
  state: string
  code: string
}

const api: NextApiHandler = async (req, res) => {
  // recieve values
  const { state = '', code = '' } = req.body as CallbackRequest

  // verify csrf token
  const csrfInstance = new CSRF()
  const isCSRFVerified = csrfInstance.verify(process.env.IRON_SECRET, state)

  if (!isCSRFVerified) {
    return res.status(400).send({
      message: 'request has been tampered',
    })
  }

  // parse signin with apple
  const clientSecret = appleSignin.getClientSecret({
    clientID: 'com.rayriffy.apple-music.auth',
    teamID: process.env.APPLE_TEAM_ID,
    privateKey: process.env.APPLE_PRIVATE_KEY.replaceAll(/\\n/g, '\n'),
    keyIdentifier: process.env.APPLE_KEY_ID,
  })

  try {
    /**
     * Verify authentication code, and get authentication data
     */
    const tokenResponse = await appleSignin.getAuthorizationToken(code, {
      clientID: 'com.rayriffy.apple-music.auth',
      redirectUri: 'https://apple-music-github-profile.rayriffy.com/api/auth/callback',
      clientSecret: clientSecret,
    })
    const { sub: appleUserId, email: appleUserEmail } = await appleSignin.verifyIdToken(
      tokenResponse.id_token,
      {
        audience: 'com.rayriffy.apple-music.auth',
        ignoreExpiration: true,
      }
    )

    /**
     * Insert user OAuth result to database
     */
    const prisma = new PrismaClient()
    await prisma.user.upsert({
      where: {
        uid: appleUserId
      },
      update: {
        appleRefreshToken: tokenResponse.refresh_token,
        updatedAt: new Date(),
      },
      create: {
        uid: appleUserId,
        appleRefreshToken: tokenResponse.refresh_token,
        email: appleUserEmail ?? null,
      },
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
    cookie(req, res).set(sessionCookieName, enclavedToken)

    return res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta http-equiv="Refresh" content="1; url=https://apple-music-github-profile.rayriffy.com/" />
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
    `)
  } catch (e) {
    console.error(e)
    return res.send({
      message: 'unable to verify authentication response from Apple'
    })
  }
}

export default api
