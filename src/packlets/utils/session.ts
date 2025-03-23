import Iron from '@hapi/iron'

import type { UserSession } from '$types/UserSession'

const { IRON_SECRET = '' } = process.env

export interface LoginSession extends UserSession {
  createdAt: number
  maxAge: number
}

export const createUserSession = (user: UserSession) =>
  Iron.seal(
    {
      ...user,
      createdAt: Date.now(),
      maxAge: 60 * 60 * 24, // 1 day
    },
    IRON_SECRET,
    Iron.defaults
  )

export const getUserSession = async (
  token: string | undefined
): Promise<LoginSession | null> => {
  if (!token) return null

  const session: LoginSession = await Iron.unseal(
    token,
    IRON_SECRET ?? '',
    Iron.defaults
  )
  const expiresAt = session.createdAt + session.maxAge * 1000

  if (Date.now() > expiresAt) return null

  return session
}
