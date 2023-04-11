import { Fragment } from 'react'

import { redirect } from 'next/navigation'

import { getUser } from '$core/services/session/getUser'
import { Steps } from '$core/components/steps'
import { ConnectAppleMusic } from '$core/components/connectAppleMusic'
import { getMusicKitDeveloperToken } from '$core/services/getMusicKitDeveloperToken'

const Page = async () => {
  const { session, connected } = await getUser()

  // if already logged in, then transfer to other page
  if (session === null) {
    redirect('/')
  }

  const developerToken = getMusicKitDeveloperToken()

  return (
    <Fragment>
      <div className="flex justify-between">
        <p className="truncate pr-2 text-sm">
          Logged in as{' '}
          <span className="font-semibold">{session?.email ?? '#EMAIL#'}</span>
        </p>
        <Steps total={3} current={2} />
      </div>
      <h1 className="pb-2 text-2xl font-semibold text-gray-900">
        Connect with Apple Music
      </h1>
      <p className="pb-2">
        {connected
          ? "You've already connected with Apple Music before. If you're having a trouble with the card, try to reconnect by connect with Apple Music again."
          : 'Now, you need to authorize access to your Apple Music to be able to obtain your recently played music.'}
      </p>
      <ConnectAppleMusic {...{ developerToken }} />
    </Fragment>
  )
}

export default Page
