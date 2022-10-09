import Iron from '@hapi/iron'

import { maxSessionAge } from '../../constants/maxSessionAge'

import type { User } from '../../@types/User'

const { IRON_SECRET } = process.env

export const createUserSession = (user: User) =>
  Iron.seal(
    {
      ...user,
      createdAt: Date.now(),
      maxAge: maxSessionAge,
    },
    IRON_SECRET,
    Iron.defaults
  )
