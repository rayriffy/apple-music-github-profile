import { memo } from 'react'

interface Props {
  current: number
  total: number
}

export const Steps = memo<Props>(props => {
  const { current, total } = props

  return (
    <nav
      className="flex shrink-0 items-center justify-end pb-4"
      aria-label="Progress"
    >
      <p className="text-sm font-medium">
        Step {current} of {total}
      </p>
      <ol role="list" className="ml-8 flex items-center space-x-5">
        {Array.from({ length: total }).map((_, i) => {
          let status =
            i + 1 === current
              ? 'current'
              : i + 1 < current
              ? 'complete'
              : 'pending'

          return (
            <li key={`step-${i}-${status}`}>
              {status === 'complete' ? (
                <div className="block h-2.5 w-2.5 rounded-full bg-indigo-600 hover:bg-indigo-900" />
              ) : status === 'current' ? (
                <div
                  className="relative flex items-center justify-center"
                  aria-current="step"
                >
                  <span
                    className="absolute flex h-5 w-5 p-px"
                    aria-hidden="true"
                  >
                    <span className="h-full w-full rounded-full bg-indigo-200" />
                  </span>
                  <span
                    className="relative block h-2.5 w-2.5 rounded-full bg-indigo-600"
                    aria-hidden="true"
                  />
                </div>
              ) : (
                <div className="block h-2.5 w-2.5 rounded-full bg-gray-200 hover:bg-gray-400" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
})
