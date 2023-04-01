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
        <p className="text-sm truncate pr-2">
          Logged in as{' '}
          <span className="font-semibold">{session?.email ?? '#EMAIL#'}</span>
        </p>
        <Steps total={3} current={3} />
      </div>
      <h1 className="font-semibold text-2xl text-gray-900 pb-2">Connected!</h1>
      <p className="pb-2">
        Congrats 🎉 You're ready to use the card! Choose card theme of your
        choice and copy following Markdown snippet into your GitHub profile.
      </p>
      <p className="text-sm pb-4">
        Having issue with the card?{' '}
        <Link href="/link" className="text-blue-500">
          Try Reconnecting it
        </Link>{' '}
        (or{' '}
        <Link href="/auth/logout" className="text-blue-500">
          Logout
        </Link>
        )
      </p>
      <div className="md:flex">
        <CardPreview uid={session!.id} />
      </div>
    </Fragment>
  )
}

export default Page
