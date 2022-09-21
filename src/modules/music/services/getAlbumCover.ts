import axios from 'axios'
import sharp from 'sharp'

import type { MixedTypeSong } from '../@types/RecentPlayedTracksResponse'

const remoteImageSize = 400

export const getAlbumCover = async (
  artwork: MixedTypeSong['attributes']['artwork']
): Promise<string | null> => {
  let coverImageData: string | null = null

  try {
    if (typeof artwork?.url === 'string') {
      // download image from apple cdn
      const rawAlbumCover = await axios.get(
        artwork.url
          .replace('{w}', remoteImageSize.toString())
          .replace(
            '{h}',
            Math.floor(
              (Number(artwork.height ?? 1) * remoteImageSize) /
                Number(artwork.width ?? 1)
            ).toString()
          ),
        {
          responseType: 'arraybuffer',
        }
      )

      // reencode image into smaller size
      const encodedCoverImage = await sharp(Buffer.from(rawAlbumCover.data))
        .resize(350)
        .jpeg({
          quality: 83,
          mozjpeg: true,
        })
        .toBuffer()
        .catch(() => {
          return Buffer.from(rawAlbumCover.data)
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
