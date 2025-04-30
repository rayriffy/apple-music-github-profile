import type { MixedTypeSong } from '$types/MixedTypeSong'
import type { RecentPlayedTracksResponse } from '$types/RecentPlayedTracksResponse'

/**
 * Obtain user's recently played track
 * @param developerToken Apple Music developer token (https://developer.apple.com/documentation/applemusicapi/generating_developer_tokens)
 * @param userToken Authorized user token (https://developer.apple.com/documentation/applemusicapi/user_authentication_for_musickit)
 */
export const getRecentlyPlayedTrack = async (
  developerToken: string,
  userToken: string
): Promise<MixedTypeSong> => {
  const rawResponse: RecentPlayedTracksResponse = await fetch(
    'https://api.music.apple.com/v1/me/recent/played/tracks',
    {
      headers: {
        Accepts: 'application/json',
        Authorization: `Bearer ${developerToken}`,
        'Music-User-Token': userToken,
        Referer: 'https://music-profile.rayriffy.com',
      },
      cache: 'no-store',
    }
  ).then(async o => {
    try {
      if (o.status >= 400 && o.status < 600) {
        throw new Error(await o.json())
      }

      return await o.json()
    } catch (e) {
      throw new Error(`Apple API route /v1/me/recent/played/tracks returned status code ${o.status} message: ${await o.text()}`)
    }
  })

  try {
    return rawResponse.data[0]
  } catch (e) {
    console.error('>>> data: ', JSON.stringify(rawResponse))
    console.error('')
    throw e
  }
}

export const revalidate = 0
