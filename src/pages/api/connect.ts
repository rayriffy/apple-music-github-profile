import { PrismaClient } from "@prisma/client";
import type { NextApiHandler } from "next";

import { getUserSession } from "../../core/services/session/getUserSession";

const api: NextApiHandler = async (req, res) => {
  const userSession = await getUserSession(req)
    // .catch(e => null)

  if (userSession === null) {
    return res.status(400).send({
      message: 'not authenticated'
    })
  }

  const prisma = new PrismaClient()
  await prisma.user.update({
    where: {
      uid: userSession.id
    },
    data: {
      appleMusicToken: req.body.userToken,
      updatedAt: new Date()
    }
  })
  await prisma.$disconnect()

  return res.send({
    message: 'ok'
  })
}

export default api
