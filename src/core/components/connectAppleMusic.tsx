'use client'

import { memo, useState } from 'react'

import Script from 'next/script'

import { AppleMusicAuthorizeButton } from './appleMusicAuthorizeButton'

interface Props {
  developerToken: string
}

export const ConnectAppleMusic = memo<Props>(props => {
  const { developerToken } = props

  const [musicKitLoadingState, setMusicKitLoadingState] = useState<
    'init' | 'fail' | 'done'
  >('init')

  return (
    <div className="mt-2">
      <div className="flex justify-center">
        {musicKitLoadingState === 'init' ? (
          <button
            disabled
            className="inline-flex cursor-wait items-center rounded-md border bg-white px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            Loading MusicKit...
          </button>
        ) : musicKitLoadingState === 'fail' ? (
          <button
            className="inline-flex cursor-not-allowed items-center rounded-md border bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-900 focus:ring-offset-2"
            disabled
          >
            Failed to load MusicKit
          </button>
        ) : (
          <AppleMusicAuthorizeButton />
        )}
      </div>
      <Script
        src="https://js-cdn.music.apple.com/musickit/v3/musickit.js"
        async
        onLoad={async () => {
          try {
            await MusicKit.configure({
              developerToken,
              app: {
                name: 'Apple Music GitHub Profile',
                build: '1.0.0',
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
