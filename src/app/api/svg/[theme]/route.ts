import fs from 'node:fs'
import path from 'node:path'

import { render } from 'art-template'
import { NextResponse } from 'next/server'

import { collections } from '$context/mongo'
import { renderErrorCard } from '$core/services/renderErrorCard'
import { getMusicKitDeveloperToken } from '$core/services/getMusicKitDeveloperToken'
import { getRecentlyPlayedTrack } from '$modules/music/services/getRecentlyPlayedTrack'
import { getAlbumCover } from '$modules/music/services/getAlbumCover'
import { optimizeSVG } from '$core/services/optimizeSVG'
import { getClientAddress } from '$core/services/getClientAddress'

export const GET = async (req: Request, context) => {
  const params = new URL(req.url).searchParams

  const theme = (await context.params).theme
  const uid = params.get('uid')

  try {
    if (params.keys.length > 1)
      throw new Error('Parameter exceed')
    if (typeof theme !== 'string' || typeof uid !== 'string')
      throw new Error('Illegal query')

    /**
     * make sure template file exists
     */
    const targetTemplateFile = path.join(
      process.cwd(),
      'src/templates',
      `${theme}.art`
    )
    if (
      !(await fs.promises
        .access(targetTemplateFile, fs.constants.R_OK)
        .then(() => true)
        .catch(() => false))
    ) {
      throw new Error('Requested template does not exist')
    }

    /**
     * Locate user apple music token
     */
    const targetUser = await collections.users.findOne({
      uid,
    })

    if (!targetUser)
      throw new Error('User does not exist')
    if (typeof targetUser.token.music !== 'string')
      throw new Error('Account does not connected to Apple Music yet')

    /**
     * Get all tokens
     */
    const userToken = targetUser.token.music
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
      const minute = Math.floor(millisec / (60 * 1000))
      const seconds = Math.ceil((millisec - minute * 60 * 1000) / 1000)

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

    try {
      const optimizedRender = optimizeSVG(
        render(templateFile, builtRenderedData)
      )

      // update when successfully rendered
      const loggedAt = new Date()
      Promise.allSettled([
        collections.users.updateOne(
          {
            uid,
          },
          {
            $set: {
              lastSeenAt: loggedAt,
            },
          }
        ),
        collections.logs.insertOne({
          uid,
          clientAddress: await getClientAddress(),
          loggedAt,
        }),
      ])

      /**
       * Store in local browser for 60 seconds
       * Stored cache on server is fresh for 128 seconds
       * After that, cache on server still serveable for 31 days but it will trigger for a fresh update
       */
      return new NextResponse(optimizedRender, {
        headers: {
          'Content-Type': 'image/svg+xml',
          ...(process.env.NODE_ENV === 'production'
            ? {
                'Cache-Control': `public, max-age=60, s-maxage=128, stale-while-revalidate=${
                  60 * 60 * 24 * 31
                }`,
              }
            : {}),
        },
      })
    } catch (e) {
      throw new Error('Unable to render SVG string')
    }
  } catch (e) {
    const renderedCard = await renderErrorCard(e.message ?? 'Unexpected error')

    return new NextResponse(renderedCard, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=10',
      },
    })
  }
}
