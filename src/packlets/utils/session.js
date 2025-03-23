import Iron from '@hapi/iron'
const { IRON_SECRET = '' } = process.env
export const createUserSession = user =>
  Iron.seal(
    {
      ...user,
      createdAt: Date.now(),
      maxAge: 60 * 60 * 24, // 1 day
    },
    IRON_SECRET,
    Iron.defaults
  )
export const getUserSession = async token => {
  if (!token) return null
  const session = await Iron.unseal(token, IRON_SECRET ?? '', Iron.defaults)
  const expiresAt = session.createdAt + session.maxAge * 1000
  if (Date.now() > expiresAt) return null
  return session
}
