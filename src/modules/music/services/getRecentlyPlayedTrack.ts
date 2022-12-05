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
    }
  ).then(async o => {
    if (o.status >= 400 && o.status < 600) {
      console.log('>>> statusCode: ', o.status)
      console.log('>>> data: ', await o.text())
      console.log('')
      throw new Error(await o.json())
    }

    return await o.json()
  })

  return rawResponse.data[0]
}
