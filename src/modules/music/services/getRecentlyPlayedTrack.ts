import type { RecentPlayedTracksResponse } from '../@types/RecentPlayedTracksResponse'

export const getRecentlyPlayedTrack = async (
  developerToken: string,
  userToken: string
) => {
  const rawResponse: RecentPlayedTracksResponse = await fetch('https://api.music.apple.com/v1/me/recent/played/tracks', {
    headers: {
      Accepts: 'application/json',
      Authorization: `Bearer ${developerToken}`,
      'Music-User-Token': userToken,
      Referer: 'https://apple-music-github-profile.rayriffy.com',
    }
  }).then(async o => {
    if (o.status >= 400 && o.status < 600) {
      throw new Error((await o.json()))
    }

    return await o.json()
  })

  return rawResponse.data[0]
}
