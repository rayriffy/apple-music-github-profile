import { Static } from 'elysia'
import { themeModel } from '$model/theme'

export type Theme = Static<typeof themeModel>
