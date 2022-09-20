import type { NextApiHandler } from 'next'

import { PrismaClient } from '@prisma/client'
import { nanoid } from 'nanoid'

import { completeAuthenticatorChallenge } from '../../../modules/register/services/completeAuthenticatorChallenge'
import { createAuthenticatorChallenge } from '../../../modules/register/services/createAuthenticatorChallenge'
import { encodeBase64 } from '../../../core/services/encodeBase64'
import { setSession } from '../../../core/services/session/set'
import { relyingParty } from '../../../core/constants/relyingParty'

import type { AuthenticatorChallenge } from '../../../core/@types/AuthenticatorChallenge'
import type { RegisterRequest } from '../../../core/@types/api/RegisterRequest'

const api: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    const username = (req.query['username'] as string) ?? ''

    if (typeof username !== 'string') {
      return res.status(400).send({
        message: 'invalid input',
      })
    }

    // if no username is provided, then dead
    if (username === null || username.trim() === '') {
      return res.status(400).send({
        message: 'no username provided',
      })
    } else if (!/^\w+$/.test(username)) {
      return res.status(400).send({
        message: 'illegal character'
      })
    }

    // check if there're any existing records for this username
    const prisma = new PrismaClient()
    const user = await prisma.user.findFirst({
      where: {
        username: username.toLowerCase(),
      },
    })

    // if user already completed registration, then dead
    if (user?.registered) {
      return res.status(400).send({
        message: 'username has already been taken',
      })
    }

    const generatedUserId = user?.uid ?? nanoid()

    // if user not found then create a new one
    if (user === null) {
      await prisma.user.create({
        data: {
          uid: generatedUserId,
          username: username.toLowerCase(),
        },
      })
    }

    const challenge = await createAuthenticatorChallenge(
      prisma,
      generatedUserId
    )

    // terminate connection
    await prisma.$disconnect()

    // build payload
    const payload: AuthenticatorChallenge = {
      rp: relyingParty,
      uid: encodeBase64(Buffer.from(generatedUserId)),
      challenge: challenge,
    }

    return res.send({
      message: 'ok',
      data: payload as any,
    })
  } else {
    const request = req.body as RegisterRequest

    const prisma = new PrismaClient()

    try {
      const completedChallenge = await completeAuthenticatorChallenge(
        prisma,
        request.response.clientDataJSON,
        request.response.attestationObject
      )

      // allow user to be registered
      await prisma.user.update({
        where: {
          uid: completedChallenge.uid,
        },
        data: {
          registered: true,
        },
      })
      await prisma.$disconnect()

      // issue user token
      const authenticatedToken = await setSession({
        id: completedChallenge.uid,
        username: completedChallenge.username,
      })

      return res.send({
        message: 'ok',
        data: authenticatedToken,
      })
    } catch (e) {
      let errorMessage: string = (e as any).message
      switch (errorMessage) {
        case 'challenge-failed':
          errorMessage = 'challenge response does not match'
          break
      }

      return res.status(400).send({
        message: errorMessage,
      })
    }
  }
}

export default api
