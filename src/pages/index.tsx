import type { GetServerSideProps, NextPage } from 'next'

import { FaApple } from 'react-icons/fa'

interface Props {
  developerToken: string
}

const Page: NextPage<Props> = props => {
  return (
    <main className="my-8 space-y-6 max-w-xl mx-auto">
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
        </div>
      </section>

      <a
        href="/api/auth/login"
        className="inline-flex items-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
      >
        <FaApple className="w-4 h-4 mr-1" /> Sign in with Apple
      </a>
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
