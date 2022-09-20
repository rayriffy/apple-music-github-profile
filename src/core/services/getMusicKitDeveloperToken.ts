import jwt from 'jsonwebtoken'

const { APPLE_PRIVATE_KEY, APPLE_KEY_ID, APPLE_TEAM_ID } = process.env

export const getMusicKitDeveloperToken = (keyDuration = '1h') => {
  const token = jwt.sign(
    process.env.NODE_ENV === 'production'
      ? {
          origin: ['https://apple-music.rayriffy.com'],
        }
      : {},
    APPLE_PRIVATE_KEY,
    {
      issuer: APPLE_TEAM_ID,
      expiresIn: keyDuration,
      algorithm: 'ES256',
      header: {
        alg: 'ES256',
        kid: APPLE_KEY_ID,
      },
    }
  )

  return token
}
