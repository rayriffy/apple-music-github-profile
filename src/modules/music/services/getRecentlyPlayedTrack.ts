import type {
  MixedTypeSong,
  RecentPlayedTracksResponse,
} from '../@types/RecentPlayedTracksResponse'

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
        Referer: 'https://apple-music-github-profile.rayriffy.com',
      },
      next: {
        revalidate: 0,
      },
    }
  ).then(async o => {
    try {
      if (o.status >= 400 && o.status < 600) {
        throw new Error(await o.json())
      }

      return await o.json()
    } catch (e) {
      console.log('>>> statusCode: ', o.status)
      console.log('>>> data: ', await o.text())
      console.log('')
      throw e
    }
  })

  try {
    return rawResponse.data[0]
  } catch (e) {
    console.log('>>> data: ', JSON.stringify(rawResponse))
    console.log('')
    throw e
  }
}

export const revalidate = 0
