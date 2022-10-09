import type { NextApiHandler } from "next"

import appleSignin from 'apple-signin-auth'
import CSRF from 'csrf'

interface CallbackRequest {
  state: string
  code: string
}

const api: NextApiHandler = async (req, res) => {
  // recieve values
  const {
    state = "",
    code = "",
  } = req.body as CallbackRequest

  // verify csrf token
  const csrfInstance = new CSRF()
  const isCSRFVerified = csrfInstance.verify(process.env.IRON_SECRET, state)

  if (!isCSRFVerified) {
    return res.status(400).send({
      message: 'request has been tampered'
    })
  }

  // parse signin with apple
  const clientSecret = appleSignin.getClientSecret({
    clientID: 'com.rayriffy.apple-music.auth',
    teamID: process.env.APPLE_TEAM_ID,
    privateKey: process.env.APPLE_PRIVATE_KEY.replaceAll(/\\n/g, "\n"),
    keyIdentifier: process.env.APPLE_KEY_ID,
  })
  
  try {
    const appleUser = await appleSignin.getAuthorizationToken(code, {
      clientID: 'com.rayriffy.apple-music.auth',
      redirectUri: 'https://apple-music.rayriffy.com/api/auth/callback',
      clientSecret: clientSecret
    })


    return res.send({
      body: req.body ?? {},
      query: req.query ?? {},
      appleUser,
    })
  } catch (e) {}
  return res.send({
    body: req.body ?? {},
    query: req.query ?? {},
  })
}

export default api
