import sharp from 'sharp'

import type { MixedTypeSong } from '../@types/RecentPlayedTracksResponse'

const remoteImageSize = 400

export const getAlbumCover = async (
  artwork: MixedTypeSong['attributes']['artwork']
): Promise<string | null> => {
  let coverImageData: string | null = null

  try {
    if (typeof artwork?.url === 'string') {
      // build cover url
      let albumCoverUrl = artwork.url
        .replace('{w}', remoteImageSize.toString())
        .replace(
          '{h}',
          Math.floor(
            (Number(artwork.height ?? 1) * remoteImageSize) /
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

      // reencode image into smaller size
      const encodedCoverImage = await sharp(Buffer.from(rawAlbumCover))
        .resize(350)
        .jpeg({
          quality: 83,
          mozjpeg: true,
        })
        .toBuffer()
        .catch(() => {
          return Buffer.from(rawAlbumCover)
        })

      coverImageData = `data:image/jpeg;base64,${encodedCoverImage.toString(
        'base64'
      )}`
    }

    return coverImageData
  } catch (e) {
    return null
  }
}
