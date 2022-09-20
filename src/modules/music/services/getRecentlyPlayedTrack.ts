import axios from 'axios'

import type { RecentPlayedTracksResponse } from '../@types/RecentPlayedTracksResponse'

export const getRecentlyPlayedTrack = async (
  developerToken: string,
  userToken: string
) => {
  const rawResponse = await axios.get<RecentPlayedTracksResponse>(
    'https://api.music.apple.com/v1/me/recent/played/tracks',
    {
      headers: {
        Authorization: `Bearer ${developerToken}`,
        'Music-User-Token': userToken,
      },
    }
  )

  return rawResponse.data.data[0]
}
