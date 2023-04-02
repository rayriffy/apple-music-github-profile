import { NextResponse } from 'next/server'
import { serialize } from 'cookie'

import { sessionCookieName } from '$core/constants/sessionCookieName'

export const GET = () => {
  return new NextResponse(
    `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta http-equiv="Refresh" content="1; url=https://music-profile.rayriffy.com/" />
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
  `,
    {
      headers: {
        'Content-Type': 'text/html',
        'Set-Cookie': serialize(sessionCookieName, '', {
          maxAge: -1,
          path: '/',
        }),
      },
    }
  )
}
