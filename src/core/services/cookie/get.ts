import { parse } from './parse'

import type { PossibleRequests } from '.'

export const get = (req: PossibleRequests, cookieName: string) => {
  const cookies = parse(req)
  return cookies[cookieName]
}
