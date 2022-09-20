import { Fragment, useMemo } from 'react'

import type { GetServerSideProps, NextPage } from 'next'

import { AppleMusicIcon } from '../modules/music/components/appleMusicIcon'
import { ExternalLinkIcon } from '../modules/music/components/externalLinkIcon'
import { classNames } from '../core/services/classNames'

import type { MixedTypeSong } from '../modules/music/@types/RecentPlayedTracksResponse'

interface Props {
  error: boolean
  data: {
    song: MixedTypeSong
    encodedImage: string
  }
}

// expectd size 320 * 458

const Page: NextPage<Props> = props => {
  const {
    error,
    data: { song, encodedImage },
  } = props

  const getDuration = (millisec: number) => {
    let minute = Math.floor(millisec / (60 * 1000))
    let seconds = Math.ceil((millisec - minute * 60 * 1000) / 1000)

    return `${minute}:${seconds.toString().padStart(2, '0')}`
  }

  // const isLibrarySong = useMemo(() => song.type === 'library-songs', [song.type])

  // f8f8fa
  return (
    <div className="h-full">
      <div
        className="bg-[#f8f8fa] px-6 py-6"
        // style={{
        //   background:
        //     song.type === 'library-songs'
        //       ? '#f8f8fa'
        //       : `#${song.attributes.artwork.bgColor}`,
        // }}
      >
        <div className="flex items-center leading-none space-x-1.5 mb-3">
          <AppleMusicIcon className="text-gray-600 h-4 mb-1" />
          <span className="text-gray-600 font-medium"> · Recently played</span>
        </div>
        <img
          src={`data:image/jpeg;base64,${encodedImage}`}
          width={300}
          className="w-72 rounded-xl overflow-hidden mx-auto shadow-lg shadow-gray-400"
        />
        <div className="mt-5">
          <h1 className="font-bold text-lg text-gray-900 truncate">
            {song.attributes.name}
          </h1>
          <h2 className="text-sm text-gray-500 truncate">
            {song.attributes.artistName}
          </h2>
        </div>
        <div className="mt-4">
          <div className="w-full h-2.5 bg-gray-300 rounded-full overflow-hidden mb-1">
            <div className="w-1/3 h-full bg-gray-600" />
          </div>
          <div className="flex justify-between">
            <p className="text-xs text-gray-600">
              {getDuration(song.attributes.durationInMillis / 3)}
            </p>
            <p className="text-xs text-gray-600">
              -{getDuration((song.attributes.durationInMillis * 2) / 3)}
            </p>
          </div>
        </div>
        <div className="mt-4">
          {song.type === 'songs' && (
            <a href={song.attributes.url}>
              <button className="text-red-600 bg-rose-100 text-bold text-sm font-semibold rounded-lg w-full py-2 px-3 flex justify-center items-center">
                View on Apple Music
                <ExternalLinkIcon className="w-4 h-4 text-red-600 ml-1" />
              </button>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { default: axios } = await import('axios')
  const { default: sharp } = await import('sharp')
  const { getMusicKitDeveloperToken } = await import(
    '../core/services/getMusicKitDeveloperToken'
  )
  const { getRecentlyPlayedTrack } = await import(
    '../modules/music/services/getRecentlyPlayedTrack'
  )

  const developerToken = await getMusicKitDeveloperToken('1m')
  const recentlyPlayedTrack = await getRecentlyPlayedTrack(
    developerToken,
    process.env.SAMPLE_USER_TOKEN
  )

  // download album cover
  const rawAlbumCover = await axios.get(
    recentlyPlayedTrack.attributes.artwork.url
      .replace('{w}', '600')
      .replace(
        '{h}',
        (
          (Number(recentlyPlayedTrack.attributes.artwork.height ?? 1) * 600) /
          Number(recentlyPlayedTrack.attributes.artwork.width ?? 1)
        ).toString()
      ),
    {
      responseType: 'arraybuffer',
    }
  )
  // encode album cover
  const encodedCoverImage = await sharp(Buffer.from(rawAlbumCover.data))
    .resize(400)
    .jpeg({
      quality: 90,
      mozjpeg: true,
    })
    .toBuffer()

  return {
    props: {
      error: false,
      data: {
        song: recentlyPlayedTrack,
        encodedImage: encodedCoverImage.toString('base64'),
      },
    },
  }
}

export default Page
