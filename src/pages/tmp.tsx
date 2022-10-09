import { Fragment, useState } from 'react'

import type { GetServerSideProps, NextPage } from 'next'
import Script from 'next/script'
import { FaApple } from 'react-icons/fa'

interface Props {
  developerToken: string
}

const Page: NextPage<Props> = props => {
  const { developerToken } = props

  const [musicKitLoadingState, setMusicKitLoadingState] = useState<
    'init' | 'fail' | 'done'
  >('init')

  // const onAuthorize = async () => {
  //   const music = MusicKit.getInstance()
  //   const userToken = await music.authorize()

  //   console.log({ developerToken, userToken })
  // }

  return (
    <div className="my-8 space-y-6 max-w-xl mx-auto">
      <section>
        <h1 className="font-semibold text-2xl text-gray-900">
          Apple Music GitHub profile
        </h1>
        <p className="text-gray-700">
          Displaying your recently played on your Apple Music to GitHub profile (i.e.
          GitHub markdown)
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
            Image will be refreshed <b>every 5 minutes</b>. If you get an error message
            on your image or fail to authenticate MusicKit after passkeys registered, try to refresh token with an button below.
          </div>
        </div>
      </section>

      {musicKitLoadingState === 'done' ? (
        <div className="space-y-2">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            <FaApple className="w-4 h-4 mr-1" /> Sign in with Apple
          </button>

          {/* <div className="max-w-sm">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username identifier
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="username"
                id="username"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="rayriffy"
              />
            </div>
          </div> */}

          {/* <section className="space-x-4">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => {}}
            >
              Authorize
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Refresh token
            </button>
          </section> */}
        </div>
      ) : musicKitLoadingState === 'fail' ? (
        <p>Unable to load MusicKit instance</p>
      ) : (
        <p>Loading MusicKit instance...</p>
      )}

      <Script
        src="https://js-cdn.music.apple.com/musickit/v3/musickit.js"
        async
        onLoad={async () => {
          try {
            await MusicKit.configure({
              developerToken: developerToken,
              app: {
                name: 'GitHub Now Playing',
                build: '0.0.1',
              },
            })

            setMusicKitLoadingState('done')
          } catch (err) {
            console.error('unable to configure musickit')
            setMusicKitLoadingState('fail')
          }
        }}
      />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ res }) => {
  const { getMusicKitDeveloperToken } = await import(
    '../core/services/getMusicKitDeveloperToken'
  )

  const token = getMusicKitDeveloperToken()
  
  res.setHeader('Cache-Control', `s-maxage=${60 * 59}`) // 3 month
  return {
    props: {
      developerToken: token,
    },
  }
}

export default Page
