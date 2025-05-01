import type { MixedTypeSong } from '$types/MixedTypeSong'
import type { RecentPlayedTracksResponse } from '$types/RecentPlayedTracksResponse'
import axios from 'axios'
import { getMusicKitDeveloperToken } from './getMusicKitDeveloperToken'

/**
 * Obtain user's recently played track
 * @param developerToken Apple Music developer token (https://developer.apple.com/documentation/applemusicapi/generating_developer_tokens)
 * @param userToken Authorized user token (https://developer.apple.com/documentation/applemusicapi/user_authentication_for_musickit)
 */
export const getRecentlyPlayedTrack = async (
  userToken: string
): Promise<MixedTypeSong> => {
  try {
    const developerToken = await getMusicKitDeveloperToken()
    const queryParams = new URLSearchParams({
      limit: '1',
      types: 'songs',
    })
    const response = await axios.get<RecentPlayedTracksResponse>(
      `https://api.music.apple.com/v1/me/recent/played/tracks?${queryParams.toString()}`,
      {
        headers: {
          Accepts: 'application/json',
          Authorization: `Bearer ${developerToken}`,
          'Music-User-Token': userToken,
          Referer: 'https://music-profile.rayriffy.com',
        },
      }
    )
    
    return response.data.data[0]
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 'unknown'
      const responseData = error.response?.data || error.message
      
      throw new Error(
        `Apple API route /v1/me/recent/played/tracks returned status code ${statusCode} message: ${JSON.stringify(responseData)}`
      )
    }

    throw error
  }
}

export const revalidate = 0
