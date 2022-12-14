import { Fragment, memo } from 'react'

import { FaApple } from 'react-icons/fa'

interface Props {
  authenticated: boolean
}

export const SignInWithApple = memo<Props>(props => {
  const { authenticated } = props

  return (
    <div className="flex justify-center mt-2">
      <a
        href={authenticated ? '/api/auth/logout' : '/api/auth/login'}
        className="inline-flex items-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
      >
        {authenticated ? (
          <Fragment>Sign out</Fragment>
        ) : (
          <Fragment>
            <FaApple className="w-4 h-4 mr-1" /> Sign in with Apple
          </Fragment>
        )}
      </a>
    </div>
  )
})
