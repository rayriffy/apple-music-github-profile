import { serialize } from 'cookie'

import type { PossibleResponses } from '.'

export const remove = (res: PossibleResponses, cookieName: string) => {
  const cookie = serialize(cookieName, '', {
    maxAge: -1,
    path: '/',
  })

  res.setHeader('Set-Cookie', cookie)
}
