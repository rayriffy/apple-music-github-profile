import { t } from 'elysia'
export const themeModel = t.Union([t.Literal('light'), t.Literal('dark')])
