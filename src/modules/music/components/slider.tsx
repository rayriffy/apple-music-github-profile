import { HTMLAttributes, memo } from 'react'
import type { MixedTypeSong } from '../@types/RecentPlayedTracksResponse'

interface Props extends HTMLAttributes<HTMLDivElement> {
  part?: number
  durationInMillis: MixedTypeSong['attributes']['durationInMillis']
}

export const Slider = memo<Props>(props => {
  const { part = 3, durationInMillis, ...rest } = props

  const getDuration = (millisec: number) => {
    let minute = Math.floor(millisec / (60 * 1000))
    let seconds = Math.ceil((millisec - minute * 60 * 1000) / 1000)

    return `${minute}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div {...rest}>
      <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mb-2">
        <div className="h-full bg-gray-600" style={{
          width: `${(100 / part).toFixed(2)}%`
        }} />
      </div>
      <div className="flex justify-between">
        <p className="text-xs text-gray-600">
          {getDuration(durationInMillis / part)}
        </p>
        <p className="text-xs text-gray-600">
          -{getDuration((durationInMillis * (part - 1)) / part)}
        </p>
      </div>
    </div>
  )
})
