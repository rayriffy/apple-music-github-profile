import Iron from '@hapi/iron'

import { maxSessionAge } from '../../constants/maxSessionAge'

import type { User } from '../../@types/User'

const { IRON_SECRET } = process.env

// returns string to be set at cookie in the end
export const setSession = (userData: User) => {
  const createdAt = Date.now()

  const payload = { ...userData, createdAt, maxAge: maxSessionAge }
  return Iron.seal(payload, IRON_SECRET ?? '', Iron.defaults)
}
