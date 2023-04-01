import CSRF from 'csrf'
import appleSignin from 'apple-signin-auth'
import { FaApple } from 'react-icons/fa'

export const SignInWithApple = () => {
  // create csrf token
  const csrfInstance = new CSRF()
  const csrfToken = csrfInstance.create(process.env.CSRF_SECRET ?? '')

  // create apple urlz
  const authorizationUrl = appleSignin.getAuthorizationUrl({
    clientID: 'com.rayriffy.apple-music.auth',
    redirectUri:
      'https://apple-music-github-profile.rayriffy.com/auth/callback',
    state: csrfToken,
    responseMode: 'form_post',
    scope: 'email',
  })

  return (
    <div className="flex justify-center mt-2">
      <a
        href={authorizationUrl}
        className="inline-flex items-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
      >
        <FaApple className="w-4 h-4 mr-1" /> Sign in with Apple
      </a>
    </div>
  )
}
