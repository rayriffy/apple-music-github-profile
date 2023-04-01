import { NextResponse } from 'next/server'

import { prisma } from '$context/prisma'
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
  const targetUser = await prisma.user.findUnique({
    where: {
      uid: session.id,
    },
    select: {
      appleMusicToken: true,
    },
  })

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
  if (targetUser.appleMusicToken !== userToken) {
    await prisma.user.update({
      where: {
        uid: session.id,
      },
      data: {
        appleMusicToken: userToken,
        clientAddress: getClientAddress(),
        updatedAt: new Date(),
      },
    })
  }

  return NextResponse.json({
    message: 'ok',
  })
}
