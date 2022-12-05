import { Fragment, useState } from 'react'

import type { GetServerSideProps, NextPage } from 'next'

import { ConnectAppleMusic } from '../core/components/connectAppleMusic'
import { SignInWithApple } from '../core/components/signInWithApple'
import { CardPreview } from '../modules/music/components/cardPreview'

interface Props {
  authenticated: boolean
  connected: boolean
  uid?: string
}

const Page: NextPage<Props> = props => {
  const { authenticated, connected, uid } = props

  const [step, setStep] = useState<number>(
    !authenticated ? 1 : !connected ? 2 : 3
  )
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="grid sm:grid-cols-2 gap-4 items-center">
      <section className="px-5 py-4 bg-gray-50 rounded-lg border shadow-lg">
        <h1 className="font-bold text-lg">Step 1</h1>
        <p className="text-gray-800 text-sm">Sign in with Apple ID</p>
        <SignInWithApple authenticated={authenticated} />
      </section>
      <section className="px-5 py-4 bg-gray-50 rounded-lg border shadow-lg">
        <h1 className="font-bold text-lg">Step 2</h1>
        <p className="text-gray-800 text-sm">Connect with Apple Music</p>
        {error !== null && (
          <div className="bg-red-100 text-red-800 text-sm p-1 rounded-lg my-2">
            <h1 className="font-bold">Failed to authorize</h1>
            <p>{error}</p>
          </div>
        )}
        <ConnectAppleMusic
          disabled={!authenticated}
          onSuccess={() => setStep(3)}
          onError={e => setError(e)}
        />
        {step === 3 && (
          <p className="text-xs text-gray-500 leading-none mt-4">
            * Already connected! Before click connect button again if your card
            encounter an error.
          </p>
        )}
      </section>
      <section className="px-5 py-4 bg-gray-50 rounded-lg border shadow-lg sm:col-span-2">
        <h1 className="font-bold text-lg">Step 3</h1>
        <p className="text-gray-800 text-sm">
          Paste following Markdown content into your GitHub profile
        </p>
        <div className="flex mt-4 mb-2 flex-col sm:flex-row">
          {step !== 3 ? (
            <div className="flex-shrink-0 aspect-[345/534] bg-white rounded-xl shadow-lg w-2/3 mx-auto sm:mx-0 sm:w-2/5"></div>
          ) : (
            <CardPreview uid={uid} />
          )}
        </div>
      </section>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
}) => {
  const { prisma } = await import('../context/prisma')

  const { cookie } = await import('../core/services/cookie')
  const { getUserSession } = await import(
    '../core/services/session/getUserSession'
  )
  const { sessionCookieName } = await import(
    '../core/constants/sessionCookieName'
  )

  const userSession = await getUserSession(req).catch(() => null)

  if (userSession === null) {
    cookie(req, res).remove(sessionCookieName)
    return {
      props: {
        authenticated: false,
        connected: false,
      },
    }
  } else {
    try {
      const targetUser = await prisma.user.findUnique({
        where: {
          uid: userSession.id,
        },
        select: {
          appleMusicToken: true,
        },
      })
      const isMusicTokenExist =
        typeof targetUser?.appleMusicToken === 'string' &&
        targetUser?.appleMusicToken !== ''

      return {
        props: {
          authenticated: true,
          connected: isMusicTokenExist,
          uid: userSession.id,
        },
      }
    } catch (e) {
      console.error(e)
      return {
        props: {
          authenticated: true,
          connected: false,
          uid: userSession.id,
        },
      }
    }
  }
}

export default Page
