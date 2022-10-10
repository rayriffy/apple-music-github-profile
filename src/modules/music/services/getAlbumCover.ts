import type { MixedTypeSong } from '../@types/RecentPlayedTracksResponse'

const targetImageSize = 400

/**
 * Download image and optimize if necessary
 * @param artwork Artwork property of Apple Music API
 * @returns base64 encoded image
 */
export const getAlbumCover = async (
  artwork: MixedTypeSong['attributes']['artwork']
): Promise<string | null> => {
  let coverImageData: string | null = null

  try {
    if (typeof artwork?.url === 'string') {
      // build cover url
      let albumCoverUrl = artwork.url
        .replace('{w}', targetImageSize.toString())
        .replace(
          '{h}',
          Math.floor(
            (Number(artwork.height ?? 1) * targetImageSize) /
              Number(artwork.width ?? 1)
          ).toString()
        )
      
      // download image from apple cdn
      const rawAlbumCover = await fetch(albumCoverUrl).then(async o => {
        if (o.status >= 400 && o.status < 600) {
          throw new Error('failed to get cover')
        }

        return await o.arrayBuffer()
      })

      let encodedCoverImage: Buffer

      // if image is compressible from Apple Music API, then serve that version
      if (artwork.url.includes('{w}') && artwork.url.includes('{h}')) {
        encodedCoverImage = Buffer.from(rawAlbumCover)
      }
      // exclusive case for iCloud Music Library, self-uploaded album is not compressible from API
      else {
        const { default: sharp } = await import('sharp')
        encodedCoverImage = await sharp(Buffer.from(rawAlbumCover))
          .resize(targetImageSize)
          .jpeg({
            quality: 83,
            mozjpeg: true,
          })
          .toBuffer()
          .catch(() => {
            return Buffer.from(rawAlbumCover)
          })
      }

      // build final encoded image
      coverImageData = `data:image/jpeg;base64,${encodedCoverImage.toString(
        'base64'
      )}`
    }

    return coverImageData
  } catch (e) {
    return null
  }
}
