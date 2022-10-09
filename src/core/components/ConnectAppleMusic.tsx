import { memo, useState } from 'react'

import Script from 'next/script'

import { AppleMusicIcon } from '../../modules/music/components/appleMusicIcon'

export const ConnectAppleMusic = memo(() => {
  const [musicKitLoadingState, setMusicKitLoadingState] = useState<
    'init' | 'fail' | 'done'
  >('init')

  return (
    <div className="mt-2">
      <div className="flex justify-center">
        {musicKitLoadingState === 'init' ? (
          <button
            disabled
            className="inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 cursor-wait focus:ring-offset-2"
          >
            Loading MusicKit...
          </button>
        ) : musicKitLoadingState === 'fail' ? (
          <button
            className="inline-flex items-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-900 focus:ring-offset-2"
            disabled
          >
            Failed to load MusicKit
          </button>
        ) : (
          <button className="inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2">
            Connect <AppleMusicIcon className="h-3.5 ml-1.5 text-[#fc3c44]" />
          </button>
        )}
      </div>
      <Script
        src="https://js-cdn.music.apple.com/musickit/v3/musickit.js"
        async
        onLoad={async () => {
          try {
            const { data } = await fetch('/api/getMusicKitDeveloperToken', {
              headers: {
                Accepts: 'application/json'
              }
            }).then(o => o.json())
            await MusicKit.configure({
              developerToken: data,
              app: {
                name: 'GitHub Now Playing',
                build: '0.0.1',
              },
            })

            setMusicKitLoadingState('done')
          } catch (err) {
            setMusicKitLoadingState('fail')
          }
        }}
      />
    </div>
  )
})
