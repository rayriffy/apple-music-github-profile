import { t } from 'elysia'
export const cookie = t.Cookie(
  {
    token: t.Optional(t.String()),
  },
  {
    secure: true,
    httpOnly: true,
  }
)
