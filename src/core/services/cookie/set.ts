

import { serialize } from 'cookie'

import type { PossibleResponses } from '.'

export const set = (res: PossibleResponses, cookieName: string, cookieValue: string) => {
  const cookie = serialize(cookieName, cookieValue, {
    maxAge: 60 * 60,
    expires: new Date(Date.now() + (60 * 60 * 1000)),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  })

  res.setHeader('Set-Cookie', cookie)
}
