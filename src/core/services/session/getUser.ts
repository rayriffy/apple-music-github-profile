import { cookies } from 'next/headers'

import { getUserSession, type LoginSession } from './getUserSession'
import { prisma } from '$context/prisma'
import { sessionCookieName } from '../../constants/sessionCookieName'

interface User {
  session: LoginSession | null
  connected: boolean
}

export const getUser = async (): Promise<User> => {
  const cookieStore = cookies()

  // get user session
  const userSessionToken = cookieStore.get(sessionCookieName)
  const userSession = await getUserSession(userSessionToken?.value)

  // check if user session existed
  if (userSession === null) {
    return {
      session: null,
      connected: false,
    }
  }

  // check if user connected with appl music yet
  try {
    const targetUser = await prisma.user.findUnique({
      where: {
        uid: userSession.id,
      },
      select: {
        appleMusicToken: true,
      },
    })
    const isMusicTokenExist =
      typeof targetUser?.appleMusicToken === 'string' &&
      targetUser?.appleMusicToken !== ''

    return {
      session: userSession,
      connected: isMusicTokenExist,
    }
  } catch (e) {
    return {
      session: userSession,
      connected: false,
    }
  }
}
