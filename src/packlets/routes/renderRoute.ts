import { Elysia, t } from 'elysia'
import path from 'node:path'
import fs from 'node:fs'
import { render } from 'art-template'

import { themeModel } from '$model/theme'
import { collections } from '$utils/mongo'
import { getMusicKitDeveloperToken } from '$music/getMusicKitDeveloperToken'
import { getRecentlyPlayedTrack } from '$music/getRecentlyPlayedTrack'
import { getAlbumCover } from '$music/getAlbumCover'
import { optimizeSvg } from '$music/optimizeSvg'
import { getClientAddress } from '$utils/getClientAddress'
import { renderErrorCard } from '$music/renderErrorCard'
import { winston } from '$utils/winston'

export const renderRoute = new Elysia().use(winston).get(
  '/theme/:theme',
  async ({ params, query, headers, logger }) => {
    /**
     * make sure template file exists
     */
    const targetTemplateFile = path.join(
      process.cwd(),
      'src/templates',
      `${params.theme.replace('.svg', '')}.art`
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
     * Locate user Apple Music token
     */
    const targetUser = await collections.users.findOne({
      uid: query.uid,
    })

    if (!targetUser) throw new Error('User does not exist')
    if (typeof targetUser.token.music !== 'string')
      throw new Error('Account does not connected to Apple Music yet')

    /**
     * Get all tokens
     */
    const userToken = targetUser.token.music
    const developerToken = await getMusicKitDeveloperToken()

    /**
     * Find recently played track
     */
    const track = await getRecentlyPlayedTrack(developerToken, userToken).catch(
      e => {
        logger.error(`error occured at getRecentlyPlayedTrack\n${e.stack}`, {
          uid: query.uid,
          userToken,
        })
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
      getAlbumCover(track.attributes.artwork).catch(e => {
        logger.error(`error occured at getAlbumCover\n${e.stack}`, {
          artwork: track.attributes.artwork,
        })
        throw new Error('Unable to get album cover')
      }),
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
      const optimizedRender = optimizeSvg(
        render(templateFile, builtRenderedData)
      )

      // update when successfully rendered
      const loggedAt = new Date()
      Promise.allSettled([
        collections.users.updateOne(
          {
            uid: query.uid,
          },
          {
            $set: {
              lastSeenAt: loggedAt,
            },
          }
        ),
        collections.logs.insertOne({
          uid: query.uid,
          clientAddress: getClientAddress(headers),
          loggedAt,
        }),
      ])

      return new Response(optimizedRender, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control':
            'public, max-age=60, s-maxage=128, stale-while-revalidate=2678400',
        },
      })
    } catch (e) {
      const renderedCard = await renderErrorCard(
        (e as Error).message ?? 'Unexpected error'
      )

      return new Response(renderedCard, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=10',
        },
      })
    }
  },
  {
    query: t.Object({
      uid: t.String(),
    }),
    params: t.Object({
      theme: t.TemplateLiteral([themeModel, t.Literal('.svg')]),
    }),
  }
)
