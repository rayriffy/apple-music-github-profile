import type { GetServerSideProps, NextPage } from 'next'

import { AppleMusicIcon } from '../modules/music/components/appleMusicIcon'
import { ExternalButton } from '../modules/music/components/externalButton'
import { ExternalLinkIcon } from '../modules/music/components/externalLinkIcon'
import { Slider } from '../modules/music/components/slider'

import type { MixedTypeSong } from '../modules/music/@types/RecentPlayedTracksResponse'
import type { AppleMusicSong } from '../modules/music/@types/AppleMusicSong'

interface Props {
  error: boolean
  data: {
    song: MixedTypeSong
    encodedImage: string
  }
}

// expectd size 345 * 529

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

  return (
    <div className="bg-[#f8f8fa] h-full">
      <div className="px-6 py-6">
        <div className="flex items-center leading-none space-x-1.5 mb-3">
          <AppleMusicIcon className="text-gray-600 h-4 mb-1" />
          <span className="text-gray-600 font-medium"> · Recently played</span>
        </div>
        <img
          src={`data:image/jpeg;base64,${encodedImage}`}
          width={300}
          className="w-auto h-72 rounded-xl overflow-hidden mx-auto shadow-lg shadow-gray-400"
        />
        <div className="mt-5">
          <h1 className="font-bold text-lg text-gray-900 truncate">
            {song.attributes.name}
          </h1>
          <h2 className="text-base text-gray-500 -mt-0.5 truncate">
            {song.attributes.artistName}
          </h2>
        </div>
        <Slider
          className="mt-3"
          durationInMillis={song.attributes.durationInMillis}
        />
        <div className="mt-4">
          <ExternalButton
            type={song.type}
            url={(song as AppleMusicSong).attributes.url}
          />
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

  const developerToken = getMusicKitDeveloperToken('1m')
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
        Math.floor(
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
