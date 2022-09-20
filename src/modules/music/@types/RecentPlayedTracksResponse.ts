import type { AppleMusicSong } from './AppleMusicSong'
import type { LibrarySong } from './LibrarySong'

export type MixedTypeSong = AppleMusicSong | LibrarySong

export interface RecentPlayedTracksResponse {
  next?: string
  data: MixedTypeSong[]
}
