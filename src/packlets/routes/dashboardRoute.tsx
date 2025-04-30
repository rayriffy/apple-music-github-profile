import { Elysia, t } from 'elysia'
import { Html } from '@elysiajs/html'
import { cookie } from '$model/cookie'
import { getUserSession } from '$utils/session'
import { collections } from '$utils/mongo'
import { DashboardPage } from '$components/DashboardPage'
import { themeModel } from '$model/theme'
import { LinkPage } from '$components/LinkPage'
import { getMusicKitDeveloperToken } from '$music/getMusicKitDeveloperToken'

export const dashboardRoute = new Elysia()
  .guard({
    cookie,
    beforeHandle: async ({ set, cookie, redirect }) => {
      // reject early if token is not set
      if (cookie.token.value === undefined) return redirect('/')

      // validate token
      const token = cookie.token.value
      const userSession = await getUserSession(token)

      if (userSession == null) {
        cookie.token.remove()
        return redirect('/')
      }
    },
  })
  .resolve(async ({ cookie }) => {
    const userSession = await getUserSession(cookie.token.value)

    try {
      const user = await collections.users.findOne(
        {
          uid: userSession!.id,
        },
        {
          projection: {
            token: {
              music: 1,
            },
          },
        }
      )

      return {
        ...userSession!,
        isConnected:
          typeof user?.token.music === 'string' && user?.token.music !== '',
      }
    } catch (e) {
      return {
        ...userSession!,
        isConnected: false,
      }
    }
  })
  .get(
    '/dashboard',
    ({ id, email, isConnected, query, redirect }) => {
      if (!isConnected) return redirect('/dashboard/link')

      const selectedTheme = query.theme ?? 'light'
      return (
        <DashboardPage
          uid={id}
          email={email}
          theme={selectedTheme}
          themes={['light', 'dark']}
        />
      )
    },
    {
      query: t.Object({
        theme: t.Optional(themeModel),
      }),
    }
  )
  .get('/dashboard/link', async ({ email, isConnected }) => {
    const developerToken = await getMusicKitDeveloperToken('1h')

    return (
      <LinkPage
        email={email}
        token={developerToken}
        isConnected={isConnected}
      />
    )
  })
