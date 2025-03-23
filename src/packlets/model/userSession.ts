import { t } from 'elysia'

export const userSessionModel = t.Object({
  id: t.String(),
  email: t.String(),
})
