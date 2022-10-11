import { Fragment, useState } from 'react'

import type { GetServerSideProps, NextPage } from 'next'

import { ConnectAppleMusic } from '../core/components/connectAppleMusica'
import { SignInWithApple } from '../core/components/signInWithApplea'
import { CardPreview } from '../modules/music/components/cardPreview'

interface Props {
  authenticated: boolean
  connected: boolean
  uid?: string
}

const Page: NextPage<Props> = props => {
  const { authenticated, connected, uid } = props

  const [step, setStep] = useState<number>(!authenticated ? 1 : !connected ? 2 : 3)

  return (
    <Fragment>
      <section className="space-y-4">
        <h2 className="text-gray-900 font-semibold">How to use?</h2>
        <div className="grid sm:grid-cols-2 gap-6 text-sm">
          <div className="p-4 bg-gray-50 rounded-lg border shadow-lg">
            You will authorize access to your Apple Music, then you will get a Markdown snippet to paste into your GitHub profile.
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border shadow-lg">
            Image will be refreshed <b>every 5 minutes</b>. If you get an error
            message on your image or fail to authenticate MusicKit after
            passkeys registered, try to refresh token with an button below.
          </div>
        </div>
      </section>

      <div className="grid sm:grid-cols-2 gap-4">
        <section className="px-5 py-4 bg-gray-50 rounded-lg border shadow-lg">
          <h1 className="font-bold text-lg">Step 1</h1>
          <p className="text-gray-800 text-sm">Sign in with Apple ID</p>
          <SignInWithApple authenticated={authenticated} />
        </section>
        <section className="px-5 py-4 bg-gray-50 rounded-lg border shadow-lg">
          <h1 className="font-bold text-lg">Step 2</h1>
          <p className="text-gray-800 text-sm">Connect with Apple Music</p>
          <ConnectAppleMusic
            disabled={!authenticated}
            onSuccess={() => setStep(3)}
          />
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
    </Fragment>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  const { PrismaClient } = await import('@prisma/client')

  const { cookie } = await import('../core/services/cookie')
  const { getUserSession } = await import('../core/services/session/getUserSession')
  const { sessionCookieName } = await import('../core/constants/sessionCookieName')

  const userSession = await getUserSession(req)
    .catch(() => null)

  if (userSession === null) {
    cookie(req, res).remove(sessionCookieName)
    return {
      props: {
        authenticated: false,
        connected: false,
      }
    }
  } else {
    const prisma = new PrismaClient()

    try {
      const targetUser = await prisma.user.findUnique({
        where: {
          uid: userSession.id
        },
        select: {
          appleMusicToken: true
        }
      })
      const isMusicTokenExist = typeof targetUser?.appleMusicToken === 'string' && targetUser?.appleMusicToken !== ""

      return {
        props: {
          authenticated: true,
          connected: isMusicTokenExist,
          uid: userSession.id,
        }
      }
    } catch (e) {
      console.error(e)
      await prisma.$disconnect()
      return {
        props: {
          authenticated: true,
          connected: false,
          uid: userSession.id,
        }
      }
    }
  }
}

export default Page
