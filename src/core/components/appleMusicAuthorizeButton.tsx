import { memo, useState } from 'react'

import { AppleMusicIcon } from '../../modules/music/components/appleMusicIcon'
import { simplifiedFetch } from '../services/simplifiedFetch'

interface Props {
  disabled: boolean
  onSuccess?(): void
  onError?(message: string): void
}

export const AppleMusicAuthorizeButton = memo<Props>(props => {
  const { disabled, onSuccess = () => {}, onError = () => {} } = props

  const [progress, setProgress] = useState(false)

  const onAuthorize = async () => {
    setProgress(true)
    onError(null)

    const music = MusicKit.getInstance()

    try {
      const userToken = await music.authorize()

      try {
        await simplifiedFetch('/api/connect', {
          method: 'POST',
          body: JSON.stringify({
            userToken,
          }),
          headers: {
            'Content-Type': 'application/json',
            Accepts: 'application/json',
          },
        })

        onSuccess()
      } catch (e) {
        onError(e.message ?? 'Unexpected error occured')
      } finally {
        setProgress(false)
      }
    } catch (e) {
      onError('Unable to authorized access to Apple Music')
      setProgress(false)
    }
  }

  return (
    <button
      disabled={disabled || progress}
      onClick={onAuthorize}
      className={`inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 ${
        progress ? 'disabled:cursor-wait' : 'disabled:cursor-not-allowed'
      }`}
    >
      Connect <AppleMusicIcon className="h-3.5 ml-1.5 text-[#fc3c44]" />
    </button>
  )
})
