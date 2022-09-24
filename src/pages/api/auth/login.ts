import type { NextApiHandler } from 'next'

import appleSignin from 'apple-signin-auth'
import CSRF from 'csrf'

const api: NextApiHandler = async (req, res) => {
  // create csrf token
  const csrfInstance = new CSRF()
  const csrfToken = csrfInstance.create(process.env.IRON_SECRET)

  // create apple url
  const authorizationUrl = appleSignin.getAuthorizationUrl({
    clientID: 'com.rayriffy.apple-music.auth',
    redirectUri: 'https://apple-music.rayriffy.com/api/auth/callback',
    state: csrfToken,
    responseMode: 'form_post',
    scope: 'email',
  })

  res.redirect(authorizationUrl)
}

export default api
