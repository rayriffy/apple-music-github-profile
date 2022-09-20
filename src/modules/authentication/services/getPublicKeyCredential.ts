import type { LoginResponse } from '../../../core/@types/api/LoginResponse'
import { decodeBase64 } from '../../../core/services/decodeBase64'

export const getPublicKeyCredential = (
  challenge: LoginResponse['challenge'],
  allowedCredentials: LoginResponse['allowedCredentials']
) =>
  navigator.credentials.get({
    publicKey: {
      challenge: decodeBase64(challenge),
      allowCredentials: allowedCredentials.map(o => ({
        ...o,
        id: decodeBase64(o.id),
      })),
      userVerification: 'preferred',
    },
  }) as Promise<PublicKeyCredential | null>
