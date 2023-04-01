import Iron from '@hapi/iron'

import type { User } from '../../@types/User'

const { IRON_SECRET } = process.env

export interface LoginSession extends User {
  createdAt: number
  maxAge: number
}

export const getUserSession = async (
  token: string | undefined
): Promise<LoginSession | null> => {
  if (!token) return null

  const session = await Iron.unseal(token, IRON_SECRET ?? '', Iron.defaults)
  const expiresAt = session.createdAt + session.maxAge * 1000

  // Validate the expiration date of the session
  if (Date.now() > expiresAt) {
    // throw new Error('session-expired')
    return null
  }

  return session
}
