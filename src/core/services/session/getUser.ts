import { cookies } from 'next/headers'

import { getUserSession, type LoginSession } from './getUserSession'
import { collections } from '$context/mongo'
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
    const targetUser = await collections.users.findOne({
      uid: userSession.id,
    }, {
      projection: {
        token: {
          music: 1
        }
      }
    })
    const isMusicTokenExist =
      typeof targetUser?.token.music === 'string' &&
      targetUser?.token.music !== ''

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
