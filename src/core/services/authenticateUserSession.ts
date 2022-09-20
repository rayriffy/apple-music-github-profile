import { getSession } from './session/get'

export const authenticateUserSession = async (
  authenticationToken: string | null | undefined
) => {
  if (authenticationToken === undefined || authenticationToken === null) {
    throw new Error('not-authenticated')
  }

  // decode encrypted cookie
  return getSession(authenticationToken)
}
