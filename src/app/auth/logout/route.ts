import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { sessionCookieName } from '$core/constants/sessionCookieName'

export const GET = () => {
  const cookieStore = cookies()

  cookieStore.delete(sessionCookieName)

  redirect('/')
}
