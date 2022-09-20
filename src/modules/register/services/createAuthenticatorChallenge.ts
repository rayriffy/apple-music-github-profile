import crypto from 'crypto'

import { encodeBase64 } from '../../../core/services/encodeBase64'

import type { PrismaClient } from '@prisma/client'

export const createAuthenticatorChallenge = async (
  prismaClient: PrismaClient,
  uid: string
) => {
  // generate random challenge
  const generatedChallenge = encodeBase64(crypto.randomBytes(32))

  // push challenge to temporary bin
  await prismaClient.challenge.upsert({
    where: {
      uid: uid,
    },
    update: {
      challenge: generatedChallenge,
      createdAt: new Date(),
    },
    create: {
      uid: uid,
      challenge: generatedChallenge,
    },
  })

  return generatedChallenge
}
