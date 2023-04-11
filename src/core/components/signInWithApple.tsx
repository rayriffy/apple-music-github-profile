import CSRF from 'csrf'
import appleSignin from 'apple-signin-auth'
import { FaApple } from 'react-icons/fa'

import { redirectUri } from '$core/constants/redirectUri'

export const SignInWithApple = () => {
  // create csrf token
  const csrfInstance = new CSRF()
  const csrfToken = csrfInstance.create(process.env.CSRF_SECRET ?? '')

  // create apple urlz
  const authorizationUrl = appleSignin.getAuthorizationUrl({
    clientID: 'com.rayriffy.apple-music.auth',
    redirectUri,
    state: csrfToken,
    responseMode: 'form_post',
    scope: 'email',
  })

  return (
    <div className="mt-2 flex justify-center">
      <a
        href={authorizationUrl}
        className="inline-flex items-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
      >
        <FaApple className="mr-1 h-4 w-4" /> Sign in with Apple
      </a>
    </div>
  )
}
