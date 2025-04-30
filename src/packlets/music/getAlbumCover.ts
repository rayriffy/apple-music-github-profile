import type { MixedTypeSong } from '$types/MixedTypeSong'
import sharp from 'sharp'

const targetImageSize = 350

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
      const albumCoverUrl = artwork.url
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
        if (o.status >= 400 && o.status < 600)
          throw new Error(`Music artwork ${albumCoverUrl} returned status code ${o.status}`)

        return await o.arrayBuffer()
      })

      let encodedCoverImage: Buffer

      // if image is compressible from Apple Music API, then serve that version
      if (artwork.url.includes('{w}') && artwork.url.includes('{h}')) {
        encodedCoverImage = Buffer.from(rawAlbumCover)
      }
      // exclusive case for iCloud Music Library, self-uploaded album is not compressible from API
      else {
        encodedCoverImage = await sharp(Buffer.from(rawAlbumCover))
          .resize(targetImageSize)
          .webp({
            quality: 78,
            preset: 'picture',
            effort: 6,
            smartSubsample: true,
          })
          .toBuffer()
          .catch(() => {
            return Buffer.from(rawAlbumCover)
          })
      }

      // build final encoded image
      coverImageData = `data:image/webp;base64,${encodedCoverImage.toString(
        'base64'
      )}`
    }

    return coverImageData
  } catch (e) {
    console.error(e)
    return null
  }
}
