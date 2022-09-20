import cbor from 'cbor'

import { COSEECDHAtoPKCS } from './COSEECDHAtoPKCS'
import { decodeRegisterAuthData } from './decodeRegisterAuthData'
import { decodeBase64 } from '../../../core/services/decodeBase64'
import { encodeBase64 } from '../../../core/services/encodeBase64'

import type { PrismaClient } from '@prisma/client'
import type { ClientData } from '../../../core/@types/ClientData'
import type { AttestationCredential } from '../../../core/@types/AttestationCredential'

export const completeAuthenticatorChallenge = async (
  prismaClient: PrismaClient,
  clientDataJSON: string,
  attestationObject: string
) => {
  const clientData: ClientData = JSON.parse(
    Buffer.from(decodeBase64(clientDataJSON)).toString()
  )

  console.log('[riffy] decoded client data JSON: ', clientData)

  // even clientData.challenge is decoded from base64 above, somehow browser navigator sent back as base64url
  const encodedChallenge = encodeBase64(
    Buffer.from(clientData.challenge, 'base64url')
  )

  // find challenge pair
  const challenge = await prismaClient.challenge.findFirst({
    where: {
      challenge: encodedChallenge,
    },
    include: {
      user: {
        select: {
          uid: true,
          username: true,
        },
      },
    },
  })

  // if challenge of **non registered user** does not match, it's means that user already completed regis or challenge response are incorrect
  if (challenge === null) {
    await prismaClient.$disconnect()
    throw new Error('challenge-failed')
  }

  // process attestation into readable authenticator
  const attestationBuffer = Buffer.from(decodeBase64(attestationObject))
  const ctapMakeCredentialResponse: AttestationCredential =
    cbor.decodeAllSync(attestationBuffer)[0]

  const decodedAuthData = decodeRegisterAuthData(
    ctapMakeCredentialResponse.authData
  )
  const publicKey = COSEECDHAtoPKCS(decodedAuthData.COSEPublicKey)

  console.log('[riffy] decoded credential from attestation: ', ctapMakeCredentialResponse)
  console.log('[riffy] decoded auth data: ', decodedAuthData)

  const authenticatorPayload = {
    fmt: ctapMakeCredentialResponse.fmt,
    publicKey: encodeBase64(publicKey),
    counter: decodedAuthData.counter,
    credentialId: encodeBase64(decodedAuthData.credID),
  }

  // push authenticator to database
  await Promise.all([
    prismaClient.authenticator.create({
      data: {
        uid: challenge.user.uid,
        ...authenticatorPayload,
      },
    }),
    prismaClient.challenge.delete({
      where: {
        id: challenge.id,
      },
    }),
  ])

  return challenge.user
}
