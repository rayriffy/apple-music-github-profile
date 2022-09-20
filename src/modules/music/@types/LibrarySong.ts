import type { Song } from './Song'

export type LibrarySong = Song<
  'library-songs',
  {
    albumName: string
    discNumber: number
    genreNames: string[]
    trackNumber: number
    hasLyrics: boolean
    durationInMillis: number
    name: string
    artistName: string
    artwork: {
      width: number | null
      height: number | null
      url: string | null
    }
    playParams: {
      id: string
      kind: 'song'
      isLibrary: true
      reporting: boolean
    }
  }
>
