import type { NextApiHandler } from 'next'

import { cookie } from '../../../core/services/cookie'
import { sessionCookieName } from '../../../core/constants/sessionCookieName'

const api: NextApiHandler = (req, res) => {
  cookie(req, res).remove(sessionCookieName)

  return res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <meta http-equiv="Refresh" content="1; url=https://apple-music.rayriffy.com/" />
      <title>Authenticated</title>
      <style>
        p {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
        }
      </style>
    </head>
    <body>
      <p>Logged out! Redirecting...</p>
    </body>
  </html>
  `)
}

export default api
