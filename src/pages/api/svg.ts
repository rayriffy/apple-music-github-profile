import fs from 'fs'
import path from 'path'

import type { NextApiHandler } from 'next'
import ejs from 'ejs'
import { optimize, OptimizedSvg } from 'svgo'

import { getMusicKitDeveloperToken } from '../../core/services/getMusicKitDeveloperToken'
import { getRecentlyPlayedTrack } from '../../modules/music/services/getRecentlyPlayedTrack'
import { getAlbumCover } from '../../modules/music/services/getAlbumCover'

interface UserQuery {
  username?: string
}

const api: NextApiHandler = async (req, res) => {
  const { username } = req.query as UserQuery

  if (username !== 'rayriffy') {
    throw Error('overruled')
  }

  // get all nessesary token
  const userToken = process.env.SAMPLE_USER_TOKEN
  const developerToken = getMusicKitDeveloperToken(60)

  // find recently played track
  const track = await getRecentlyPlayedTrack(developerToken, userToken)

  const part = 3
  const getDuration = (millisec: number) => {
    let minute = Math.floor(millisec / (60 * 1000))
    let seconds = Math.ceil((millisec - minute * 60 * 1000) / 1000)

    return `${minute}:${seconds.toString().padStart(2, '0')}`
  }

  const [templateFile, coverImageData] = await Promise.all([
    fs.promises.readFile(
      path.join(process.cwd(), 'src/templates/card.ejs'),
      'utf-8'
    ),
    getAlbumCover(track.attributes.artwork)
  ])

  const renderedFile = ejs.render(templateFile, {
    title: track.attributes.name,
    artist: track.attributes.artistName ?? '',
    coverImageData,
    timestamp: {
      percentage: (100 / part).toFixed(2),
      elapsed: getDuration(track.attributes.durationInMillis / part),
      remaining: getDuration(
        (track.attributes.durationInMillis * (part - 1)) / part
      ),
    },
  })

  res.setHeader('Content-Type', 'image/svg+xml')

  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Cache-Control', 's-maxage=128, stale-while-revalidate=3600')
  }

  res.send((optimize(renderedFile) as OptimizedSvg).data)
}

export default api
