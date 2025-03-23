import type { Song } from './Song'

export type AppleMusicSong = Song<
  'songs',
  {
    albumName: string
    genreNames: string[]
    trackNumber: number
    releaseDate: string
    durationInMillis: number
    isrc: string
    artwork: {
      width: number
      height: number
      url: string
      bgColor: string
      textColor1: string
      textColor2: string
      textColor3: string
      textColor4: string
    }
    composerName: string
    playParams: {
      id: string
      kind: 'song'
    }
    url: string
    discNumber: number
    isAppleDigitalMaster: boolean
    hasLyrics: boolean
    name: string
    previews: {
      url: string
    }[]
    artistName: string
  }
>
