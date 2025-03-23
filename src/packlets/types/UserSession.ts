import { userSessionModel } from '$model/userSession'
import type { Static } from 'elysia'

export type UserSession = Static<typeof userSessionModel>
