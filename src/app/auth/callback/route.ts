import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

import appleSignin from 'apple-signin-auth'
import CSRF from 'csrf'

import { prisma } from '$context/prisma'
import { getClientAddress } from '$core/services/getClientAddress'
import { createUserSession } from '$core/services/session/createUserSession'
import { sessionCookieName } from '$core/constants/sessionCookieName'

interface CallbackRequest {
  state: string
  code: string
}

const {
  CSRF_SECRET = '',
  APPLE_TEAM_ID= '',
  APPLE_PRIVATE_KEY= '',
  APPLE_KEY_ID= '',
} = process.env

export const POST = async (request: Request) => {
  console.log('Request')
  console.log(request)
  console.log('URL: ', request.url)
  console.log('Text: ', await request.formData().then(o => o.entries()).catch(() => undefined))
  console.log('JSON: ', await request.json().catch(() => undefined))

  // parse values
  const {
    state = '',
    code = ''
  } = await request.json() as CallbackRequest

  // verify csrf token
  const csrfInstance = new CSRF()
  const isCSRFVerified = csrfInstance.verify(CSRF_SECRET, state)

  if (!isCSRFVerified) {
    return NextResponse.json({
      message: 'request has been tampered',
    }, {
      status: 400
    })
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
      redirectUri:
        'https://apple-music-github-profile.rayriffy.com/api/auth/callback',
      clientSecret: clientSecret,
    })
    const { sub: appleUserId, email: appleUserEmail } =
      await appleSignin.verifyIdToken(tokenResponse.id_token, {
        audience: 'com.rayriffy.apple-music.auth',
        ignoreExpiration: true,
      })

    /**
     * Insert user OAuth result to database
     */
    await prisma.user.upsert({
      where: {
        uid: appleUserId,
      },
      update: {
        appleRefreshToken: tokenResponse.refresh_token,
        updatedAt: new Date(),
        clientAddress: getClientAddress(),
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

    const cookieStore = cookies()
    cookieStore.set(sessionCookieName, enclavedToken)

    redirect('/link')
  } catch (e) {
    console.error(e)
    return NextResponse.json({
      message: 'unable to verify authentication response from Apple',
    }, {
      status: 500
    })
  }
}
