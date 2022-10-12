import jwt from 'jsonwebtoken'

const { RIFFY_DEBUG, APPLE_PRIVATE_KEY, APPLE_KEY_ID, APPLE_TEAM_ID } =
  process.env

export const getMusicKitDeveloperToken = (keyDuration = 60 * 60) => {
  // if (RIFFY_DEBUG === 'true') {
  //   console.log({
  //     APPLE_PRIVATE_KEY,
  //     APPLE_KEY_ID,
  //     APPLE_TEAM_ID,
  //   })
  // }

  const token = jwt.sign({}, APPLE_PRIVATE_KEY.replaceAll(/\\n/g, '\n'), {
    issuer: APPLE_TEAM_ID,
    expiresIn: keyDuration,
    algorithm: 'ES256',
    header: {
      alg: 'ES256',
      kid: APPLE_KEY_ID,
    },
  })

  return token
}
