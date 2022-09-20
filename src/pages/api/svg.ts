import fs from 'fs'
import path from 'path'

import type { NextApiHandler } from 'next'
import ejs from 'ejs'
import sharp from 'sharp'
import axios from 'axios'

import { getMusicKitDeveloperToken } from '../../core/services/getMusicKitDeveloperToken'
import { getRecentlyPlayedTrack } from '../../modules/music/services/getRecentlyPlayedTrack'

interface Props {
  username?: string
}

const api: NextApiHandler = async (req, res) => {
  // get all nessesary token
  const userToken = process.env.SAMPLE_USER_TOKEN
  const developerToken = getMusicKitDeveloperToken('1m')

  // find recently played track
  const track = await getRecentlyPlayedTrack(
    developerToken,
    userToken
  )

  const templateFile = fs.readFileSync(path.join(
    process.cwd(),
    'src/templates/card.ejs'
  ), 'utf-8')

  // if track has artwork, then download and optimize size
  let coverImageData = null
  if (typeof track.attributes?.artwork?.url === 'string') {
    const rawAlbumCover = await axios.get(
      track.attributes.artwork.url
        .replace('{w}', '600')
        .replace(
          '{h}',
          Math.floor(
            (Number(track.attributes.artwork.height ?? 1) * 600) /
            Number(track.attributes.artwork.width ?? 1)
          ).toString()
        ),
      {
        responseType: 'arraybuffer',
      }
    )

    const encodedCoverImage = await sharp(Buffer.from(rawAlbumCover.data))
      .resize(350)
      .jpeg({
        quality: 83,
        mozjpeg: true,
      })
      .toBuffer()
    
    coverImageData = `data:image/jpeg;base64,${encodedCoverImage.toString('base64')}`
  }

  const part = 3
  const getDuration = (millisec: number) => {
    let minute = Math.floor(millisec / (60 * 1000))
    let seconds = Math.ceil((millisec - minute * 60 * 1000) / 1000)

    return `${minute}:${seconds.toString().padStart(2, '0')}`
  }

  const renderedFile = ejs.render(templateFile, {
    title: track.attributes.name,
    artist: track.attributes.artistName ?? '',
    coverImageData,
    timestamp: {
      elapsed: getDuration(track.attributes.durationInMillis / part),
      remaining: getDuration((track.attributes.durationInMillis * (part - 1)) / part),
    }
  })

  res.setHeader('Content-Type', 'image/svg+xml')
  // res.setHeader('Cache-Control', 's-maxage=180')
  res.send(renderedFile)
}

export default api
