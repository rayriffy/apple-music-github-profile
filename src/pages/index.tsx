import type { GetServerSideProps, NextPage } from 'next'

import { FaApple } from 'react-icons/fa'
import { ConnectAppleMusic } from '../core/components/ConnectAppleMusic'

interface Props {
  developerToken: string
}

const Page: NextPage<Props> = props => {
  return (
    <main className="my-8 space-y-6 max-w-xl mx-auto px-4">
      <section>
        <h1 className="font-semibold text-2xl text-gray-900">
          Apple Music GitHub profile
        </h1>
        <p className="text-gray-700">
          Displaying your recently played on your Apple Music to GitHub profile
          (i.e. GitHub markdown)
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-gray-900 font-semibold">How to use?</h2>
        <div className="grid sm:grid-cols-2 gap-6 text-sm">
          <div className="bg-gray-100 p-4 rounded-lg">
            You will authorize access to your Apple Music, then you will get an
            image URL to place your Now Playing banner to anywhere
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            Image will be refreshed <b>every 5 minutes</b>. If you get an error
            message on your image or fail to authenticate MusicKit after
            passkeys registered, try to refresh token with an button below.
          </div>
          <div className="bg-red-500 col-span-2 font-bold text-lg text-white p-4 rounded-lg">
            This web application does not finished yet...literally you won't going to be able to use this app until this red dialog is gone
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <section className="px-5 py-4 bg-gray-50 rounded-lg border shadow-lg">
          <h1 className="font-bold text-lg">Step 1</h1>
          <p className="text-gray-800 text-sm">Sign in with Apple ID</p>
          <div className="flex justify-center mt-2">
            <a
              href="/api/auth/login"
              className="inline-flex items-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              <FaApple className="w-4 h-4 mr-1" /> Sign in with Apple
            </a>
          </div>
        </section>
        <section className="px-5 py-4 bg-gray-50 rounded-lg border shadow-lg">
          <h1 className="font-bold text-lg">Step 2</h1>
          <p className="text-gray-800 text-sm">Connect with Apple Music</p>
          <ConnectAppleMusic developerToken={props.developerToken} />
        </section>
        <section className="px-5 py-4 bg-gray-50 rounded-lg border shadow-lg col-span-2">
          <h1 className="font-bold text-lg">Step 3</h1>
          <p className="text-gray-800 text-sm">Paste following Markdown content into your GitHub profile</p>
          <div className="flex mt-4 mb-2">
            <div className="flex-shrink-0 aspect-[345/534] bg-white rounded-xl w-1/3 shadow-lg"></div>
          </div>
        </section>
      </div>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  res,
}) => {
  const { getMusicKitDeveloperToken } = await import(
    '../core/services/getMusicKitDeveloperToken'
  )

  const token = getMusicKitDeveloperToken()

  res.setHeader('Cache-Control', `public, maxage=${60 * 59}`) // 1 hour
  return {
    props: {
      developerToken: token,
    },
  }
}

export default Page
