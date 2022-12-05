import fs from 'fs'
import path from 'path'

import type { NextApiHandler } from 'next'

import { prisma } from '../../context/prisma'
import { getMusicKitDeveloperToken } from '../../core/services/getMusicKitDeveloperToken'
import { getRecentlyPlayedTrack } from '../../modules/music/services/getRecentlyPlayedTrack'
import { getAlbumCover } from '../../modules/music/services/getAlbumCover'
import { renderErrorCard } from '../../core/services/renderErrorCard'

interface UserQuery {
  theme?: string
  uid?: string
}

const api: NextApiHandler = async (req, res) => {
  const { theme, uid } = req.query as UserQuery

  const requiredParams = ['theme', 'uid']

  try {
    if (Object.keys(req.query).some(key => !requiredParams.includes(key))) {
      throw new Error('Parameter exceed')
    } else if (typeof theme !== 'string' || typeof uid !== 'string') {
      throw new Error('Illegal query')
    }

    /**
     * make sure template file exists
     */
    const targetTemplateFile = path.join(
      process.cwd(),
      'src/templates',
      `${theme}.art`
    )
    if (!fs.existsSync(targetTemplateFile)) {
      throw new Error('Requested template does not exist')
    }

    /**
     * Locate user apple music token
     */
    const targetUser = await prisma.user.findUnique({
      where: {
        uid: uid,
      },
    })

    if (!targetUser) {
      throw new Error('User does not exist')
    } else if (typeof targetUser.appleMusicToken !== 'string') {
      throw new Error('Account does not connected to Apple Music yet')
    }

    /**
     * Get all tokens
     */
    const userToken = targetUser.appleMusicToken
    const developerToken = getMusicKitDeveloperToken(60)

    /**
     * Find recently played track
     */
    const track = await getRecentlyPlayedTrack(developerToken, userToken).catch(
      () => {
        throw new Error(
          'Unable to get recently played track. Try to reconnect Apple Music again.'
        )
      }
    )

    /**
     * Build metadatas
     */
    const part = 3
    const getDuration = (millisec: number) => {
      let minute = Math.floor(millisec / (60 * 1000))
      let seconds = Math.ceil((millisec - minute * 60 * 1000) / 1000)

      return `${minute}:${seconds.toString().padStart(2, '0')}`
    }

    const [templateFile, coverImageData] = await Promise.all([
      fs.promises.readFile(targetTemplateFile, 'utf-8'),
      getAlbumCover(track.attributes.artwork),
    ])

    const builtRenderedData = {
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
    }

    const [{ optimize }, { render }] = await Promise.all([
      import('svgo'),
      import('art-template'),
    ])

    try {
      const optimizedRender = optimize(
        render(templateFile, builtRenderedData)
      )

      res.setHeader('Content-Type', 'image/svg+xml')

      if (process.env.NODE_ENV === 'production') {
        /**
         * Store in local browser for 60 seconds
         * Stored cache on server is fresh for 128 seconds
         * After that, cache on server still serveable for 31 days but it will trigger for a fresh update
         */
        res.setHeader(
          'Cache-Control',
          `public, max-age=60, s-maxage=128, stale-while-revalidate=${
            60 * 60 * 24 * 31
          }`
        )
      }

      res.send(optimizedRender.data)
    } catch (e) {
      throw new Error('Unable to render SVG string')
    }
  } catch (e) {
    const renderedCard = await renderErrorCard(e.message ?? 'Unexpected error')

    res.setHeader('Content-Type', 'image/svg+xml')
    res.send(renderedCard)
  }
}

export default api
