import type { NextApiHandler } from 'next'

import { prisma } from '../../context/prisma'
import { getClientAddress } from '../../core/services/getClientAddress'
import { getUserSession } from '../../core/services/session/getUserSession'

const api: NextApiHandler = async (req, res) => {
  const userSession = await getUserSession(req).catch(e => null)

  /**
   * Verify user authentication
   */
  if (userSession === null) {
    return res.status(401).send({
      message: 'not authenticated',
    })
  }

  /**
   * Looking for a valid user
   */
  const targetUser = await prisma.user.findUnique({
    where: {
      uid: userSession.id,
    },
    select: {
      appleMusicToken: true,
    },
  })

  if (!targetUser) {
    return res.status(400).send({
      message: 'illegal user',
    })
  }

  /**
   * Not to call update if token is unchanged
   */
  if (targetUser.appleMusicToken !== req.body.userToken) {
    await prisma.user.update({
      where: {
        uid: userSession.id,
      },
      data: {
        appleMusicToken: req.body.userToken,
        clientAddress: getClientAddress(req.headers),
        updatedAt: new Date(),
      },
    })
  }

  return res.send({
    message: 'ok',
  })
}

export default api
