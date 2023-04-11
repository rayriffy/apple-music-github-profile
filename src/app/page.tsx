import { Fragment } from 'react'

import { redirect } from 'next/navigation'

import { getUser } from '$core/services/session/getUser'
import { Steps } from '$core/components/steps'
import { SignInWithApple } from '$core/components/signInWithApple'

const Page = async () => {
  const { session, connected } = await getUser()

  // if already logged in, then transfer to other page
  if (session !== null) {
    redirect(connected ? '/dash' : '/link')
  }

  return (
    <Fragment>
      <Steps total={3} current={1} />
      <h1 className="pb-2 text-2xl font-semibold text-gray-900">
        Apple Music GitHub profile
      </h1>
      <p>
        This web application will be able to display your recently played music
        on your Apple Music to GitHub profile (or anywhere else!)
      </p>
      <p className="pb-3 pt-2">
        First of all, you need to sign-in with your Apple ID
      </p>
      <SignInWithApple />
    </Fragment>
  )
}

export default Page
