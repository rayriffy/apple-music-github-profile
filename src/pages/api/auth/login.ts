import type { NextApiHandler } from 'next'

import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

import { decodeBase64 } from '../../../core/services/decodeBase64'
import { encodeBase64 } from '../../../core/services/encodeBase64'
import { ASN1toPEM } from '../../../modules/login/services/ASN1toPEM'
import { decodeLoginAuthData } from '../../../modules/login/services/decodeLoginAuthData'
import { getSha256Hash } from '../../../modules/login/services/getSha256Hash'
import { verifySignature } from '../../../modules/login/services/verifySignature'
import { setSession } from '../../../core/services/session/set'

import type { ClientData } from '../../../core/@types/ClientData'
import type { LoginRequest } from '../../../core/@types/api/LoginRequest'
import type { LoginResponse } from '../../../core/@types/api/LoginResponse'

const api: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    const username = (req.query['username'] as string) ?? ''

    // locate all authenticators for this user
    const prisma = new PrismaClient()
    const authenticators = await prisma.authenticator.findMany({
      where: {
        user: {
          username: username.toLowerCase(),
          registered: true,
        },
      },
      include: {
        user: {
          select: {
            uid: true,
          },
        },
      },
    })

    // if array is 0, means there's no user registered yet
    if (authenticators.length === 0) {
      await prisma.$disconnect()
      return res.status(400).send({
        message: 'this username has not been registered yet',
      })
    }

    // generate random challenge
    const generatedChallenge = encodeBase64(crypto.randomBytes(32))

    // push chalenge to temporary bin
    await prisma.challenge.upsert({
      where: {
        uid: authenticators[0].user.uid,
      },
      update: {
        challenge: generatedChallenge,
        createdAt: new Date(),
      },
      create: {
        uid: authenticators[0].user.uid,
        challenge: generatedChallenge,
      },
    })

    await prisma.$disconnect()

    // build payload
    const payload: LoginResponse = {
      challenge: generatedChallenge,
      allowedCredentials: authenticators.map(authenticator => ({
        type: 'public-key',
        id: authenticator.credentialId,
      })),
    }
    return res.send({
      message: 'ok',
      data: payload as any,
    })
  } else {
    const { id, response } = req.body as LoginRequest

    const decodedRequest = {
      authenticatorData: decodeBase64(response.authenticatorData),
      clientDataJSON: decodeBase64(response.clientDataJSON),
      signature: decodeBase64(response.signature),
    }

    const clientData: ClientData = JSON.parse(
      Buffer.from(decodedRequest.clientDataJSON).toString()
    )

    // even clientData.challenge is decoded from base64 above, somehow browser navigator sent back as base64url
    const encodedChallenge = encodeBase64(
      Buffer.from(clientData.challenge, 'base64url')
    )

    // find challenge pair
    const prisma = new PrismaClient()

    const authenticatorPromise = await prisma.authenticator.findFirst({
      where: {
        credentialId: encodeBase64(Buffer.from(id, 'base64url')),
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
    const challengePromise = await prisma.challenge.findFirst({
      where: {
        challenge: encodedChallenge,
        user: {
          registered: true,
        },
      },
      include: {
        user: {
          select: {
            uid: true,
          },
        },
      },
    })

    const [authenticator, challenge] = await Promise.all([
      authenticatorPromise,
      challengePromise,
    ])

    // delete challenge from daatabse after being called
    if (challenge !== null) {
      await prisma.challenge.delete({
        where: {
          id: challenge.id
        }
      })
    }

    await prisma.$disconnect()

    if (challenge === null) {
      return res.status(400).send({
        message: 'challenge response does not match',
      })
    } else if (authenticator === null) {
      return res.status(400).send({
        message: 'authenticator not found',
      })
    } else if (authenticator.uid !== challenge.uid) {
      return res.status(400).send({
        message: 'authenticator and challenge do not match',
      })
    }

    const decodedAuthData = decodeLoginAuthData(
      Buffer.from(decodedRequest.authenticatorData)
    )

    const clientDataHash = getSha256Hash(
      Buffer.from(decodedRequest.clientDataJSON)
    )
    const signatureBase = Buffer.concat([
      decodedAuthData.rpIdHash,
      decodedAuthData.flagsBuf,
      decodedAuthData.counterBuf,
      clientDataHash,
    ])
    const publicKey = ASN1toPEM(
      Buffer.from(decodeBase64(authenticator.publicKey))
    )
    const signature = Buffer.from(decodedRequest.signature)

    const verified = verifySignature(signature, signatureBase, publicKey)

    if (!verified) {
      return res.status(400).send({
        message: 'signature of authenticator cannot be verified',
      })
    }

    // issue user token
    const authenticatedToken = await setSession({
      id: authenticator.user.uid,
      username: authenticator.user.username,
    })

    return res.send({
      message: 'ok',
      data: authenticatedToken,
    })
  }
}

export default api
