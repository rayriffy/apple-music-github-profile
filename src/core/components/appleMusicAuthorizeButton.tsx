'use client'

import { memo, useState } from 'react'

import { useRouter } from 'next/navigation'

import { AppleMusicIcon } from '../../modules/music/components/appleMusicIcon'
import { simplifiedFetch } from '../services/simplifiedFetch'

export const AppleMusicAuthorizeButton = memo(() => {
  const [progress, setProgress] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { push } = useRouter()

  const onAuthorize = async () => {
    setProgress(true)
    setError(null)

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

        push('/dash')
      } catch (e) {
        setError(e.message ?? 'Unexpected error occured')
      } finally {
        setProgress(false)
      }
    } catch (e) {
      setError('Unable to authorized access to Apple Music')
      setProgress(false)
    }
  }

  return (
    <button
      disabled={progress}
      onClick={onAuthorize}
      className={`inline-flex items-center rounded-md border bg-white px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 ${
        progress ? 'disabled:cursor-wait' : 'disabled:cursor-not-allowed'
      }`}
    >
      Connect <AppleMusicIcon className="ml-1.5 h-3.5 text-[#fc3c44]" />
    </button>
  )
})
