import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'
import { html } from '@elysiajs/html'
import { cors } from '@elysiajs/cors'
import { logger } from '@bogeychan/elysia-logger'

import { authenticationRoute } from '$routes/authenticationRoute'
import { dashboardRoute } from '$routes/dashboardRoute'
import { renderRoute } from '$routes/renderRoute'

const app = new Elysia()
  .use(logger())
  .use(cors())
  .use(
    staticPlugin({
      prefix: '/',
    })
  )
  .use(html())
  .use(authenticationRoute)
  .use(dashboardRoute)
  .use(renderRoute)
  .listen(3000)

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
)
