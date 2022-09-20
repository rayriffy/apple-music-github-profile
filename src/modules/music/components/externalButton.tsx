import { Fragment, memo } from 'react'

import { ExternalLinkIcon } from './externalLinkIcon'

import type { AppleMusicSong } from '../@types/AppleMusicSong'
import type { MixedTypeSong } from '../@types/RecentPlayedTracksResponse'

interface Props {
  type: MixedTypeSong['type']
  url?: AppleMusicSong['attributes']['url']
}

export const ExternalButton = memo<Props>(props => {
  const { type, url } = props

  return (
    <Fragment>
      {type === 'songs' ? (
        <a href={url} target="_blank" rel="noopener noreferer">
          <button className="text-red-600 bg-rose-100 text-bold text-sm font-semibold rounded-lg w-full py-2 px-3 flex justify-center items-center">
            View on Apple Music
            <ExternalLinkIcon className="w-4 h-4 text-red-600 ml-1" />
          </button>
        </a>
      ) : (
        <button
          className="bg-gray-800 text-white text-bold text-sm font-semibold rounded-lg w-full py-2 px-3 flex justify-center items-center"
          // style={{
          //   backgroundColor: '#e5e5e5',
          //   opacity: 0.8,
          //   background:
          //     'linear-gradient(135deg, #22222255 25%, transparent 25%) -10px 0/ 20px 20px, linear-gradient(225deg, #222222 25%, transparent 25%) -10px 0/ 20px 20px, linear-gradient(315deg, #22222255 25%, transparent 25%) 0px 0/ 20px 20px, linear-gradient(45deg, #222222 25%, #e5e5e5 25%) 0px 0/ 20px 20px',
          // }}
        >
          Unavailable on Apple Music
        </button>
      )}
    </Fragment>
  )
})
