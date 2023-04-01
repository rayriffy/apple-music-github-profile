import Link from 'next/link'
import { memo } from 'react'

import { FaApple } from 'react-icons/fa'

export const SignInWithApple = memo(() => {
  return (
    <div className="flex justify-center mt-2">
      <Link
        href="/auth/login"
        className="inline-flex items-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
      >
        <FaApple className="w-4 h-4 mr-1" /> Sign in with Apple
      </Link>
    </div>
  )
})
