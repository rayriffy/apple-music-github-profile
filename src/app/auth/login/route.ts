import { redirect } from 'next/navigation'

import appleSignin from 'apple-signin-auth'
import CSRF from 'csrf'

export const GET = async () => {
  // create csrf token
  const csrfInstance = new CSRF()
  const csrfToken = csrfInstance.create(process.env.CSRF_SECRET ?? '')

  // create apple urlz
  const authorizationUrl = appleSignin.getAuthorizationUrl({
    clientID: 'com.rayriffy.apple-music.auth',
    redirectUri:
      'https://apple-music-github-profile.rayriffy.com/callback',
    state: csrfToken,
    responseMode: 'form_post',
    scope: 'email',
  })

  redirect(authorizationUrl)
}
