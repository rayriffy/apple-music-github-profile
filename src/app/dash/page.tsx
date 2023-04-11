import { Fragment } from 'react'

import { redirect } from 'next/navigation'

import { Steps } from '$core/components/steps'
import { getUser } from '$core/services/session/getUser'
import { CardPreview } from '$modules/music/components/cardPreview'
import Link from 'next/link'

const Page = async () => {
  const { session, connected } = await getUser()

  if (!connected) {
    redirect(session === null ? '/' : '/link')
  }

  return (
    <Fragment>
      <div className="flex justify-between">
        <p className="truncate pr-2 text-sm">
          Logged in as{' '}
          <span className="font-semibold">{session?.email ?? '#EMAIL#'}</span>
        </p>
        <Steps total={3} current={3} />
      </div>
      <h1 className="pb-2 text-2xl font-semibold text-gray-900">Connected!</h1>
      <p className="pb-2">
        Congrats 🎉 You're ready to use the card! Choose card theme of your
        choice and copy following Markdown snippet into your GitHub profile.
      </p>
      <p className="pb-4 text-sm">
        Having issue with the card?{' '}
        <Link href="/link" className="text-blue-500">
          Try Reconnecting it
        </Link>{' '}
        (or{' '}
        <a href="/auth/logout" className="text-blue-500">
          Logout
        </a>
        )
      </p>
      <div className="md:flex">
        <CardPreview uid={session!.id} />
      </div>
    </Fragment>
  )
}

export default Page
