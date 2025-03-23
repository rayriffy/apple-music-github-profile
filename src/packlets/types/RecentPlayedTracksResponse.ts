import { MixedTypeSong } from '$types/MixedTypeSong'

export interface RecentPlayedTracksResponse {
  next?: string
  data: MixedTypeSong[]
}
