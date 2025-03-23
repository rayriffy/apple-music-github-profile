import { SignJWT, importPKCS8 } from 'jose'
const {
  APPLE_PRIVATE_KEY = '',
  APPLE_KEY_ID = '',
  APPLE_TEAM_ID = '',
} = process.env
export const getMusicKitDeveloperToken = async (duration = '1m') => {
  const privateKey = await importPKCS8(
    APPLE_PRIVATE_KEY.replaceAll(/\\n/g, '\n'),
    'ES256'
  )
  const token = await new SignJWT()
    .setProtectedHeader({
      alg: 'ES256',
      kid: APPLE_KEY_ID,
    })
    .setIssuer(APPLE_TEAM_ID)
    .setExpirationTime(duration)
    .setIssuedAt()
    .sign(privateKey)
  return token
}
