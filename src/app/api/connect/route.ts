import { NextResponse } from 'next/server'

import { collections } from '$context/mongo'
import { getClientAddress } from '$core/services/getClientAddress'
import { getUser } from '$core/services/session/getUser'

export const POST = async (req: Request) => {
  const { userToken } = await req.json()
  const { session } = await getUser()

  if (!userToken) {
    return NextResponse.json(
      {
        message: 'missing args',
      },
      {
        status: 400,
      }
    )
  }

  /**
   * Verify user authentication
   */
  if (session === null) {
    return NextResponse.json(
      {
        message: 'not authenticated',
      },
      {
        status: 403,
      }
    )
  }

  /**
   * Looking for a valid user
   */
  const targetUser = await collections.users.findOne(
    {
      uid: session.id,
    },
    {
      projection: {
        token: {
          music: 1,
        },
      },
    }
  )

  if (!targetUser) {
    return NextResponse.json(
      {
        message: 'illegal user',
      },
      {
        status: 400,
      }
    )
  }

  /**
   * Not to call update if token is unchanged
   */
  if (targetUser.token.music !== userToken) {
    await collections.users.updateOne(
      {
        uid: session.id,
      },
      {
        $set: {
          'token.music': userToken,
          clientAddress: getClientAddress(),
          updatedAt: new Date(),
        },
      }
    )
  }

  return NextResponse.json({
    message: 'ok',
  })
}
