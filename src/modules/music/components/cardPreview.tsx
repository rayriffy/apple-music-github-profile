import { Fragment, memo, useMemo } from 'react'

import { themes } from '../../../core/constants/themes'
import { useDebounceState } from '../../../core/services/debounce/useDebounceState'

interface Props {
  uid: string
}

export const CardPreview = memo<Props>(props => {
  const { uid } = props

  const [selectedTheme, setSelectedTheme] = useDebounceState(themes[0].id, 500)
  const builtUrl = useMemo(
    () =>
      `https://apple-music-github-profile.rayriffy.com/theme/${selectedTheme}.svg?${new URLSearchParams({
        uid: uid,
      }).toString()}`,
    [uid, selectedTheme]
  )

  return (
    <Fragment>
      <div className="w-2/3 mx-auto mb-6 sm:mx-0 sm:mb-0 sm:w-2/5 flex-shrink-0">
        <img
          loading="lazy"
          className='border rounded-xl shadow-lg overflow-hidden'
          src={builtUrl}
          width={345}
          height={534}
        />
      </div>
      <div className="rounded-xl w-full break-all pl-4 space-y-4">
        <div>
          <label
            htmlFor="themeSelector"
            className="block text-sm font-medium text-gray-700"
          >
            Theme
          </label>
          <select
            id="themeSelector"
            defaultValue={selectedTheme}
            onChange={e => {
              setSelectedTheme(e.target.value)
            }}
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            {themes.map(theme => (
              <option
                key={`themeSelector-option-${theme.id}`}
                value={theme.id}
              >
                {theme.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="markdownContent" className="block text-sm font-medium text-gray-700">
            Markdown content
          </label>
          <div className="mt-1">
            <textarea
              rows={8}
              name="comment"
              id="comment"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs font-mono"
            >
              [![Apple Music GitHub profile]({builtUrl})](https://github.com/rayriffy/apple-music-github-profile)
            </textarea>
          </div>
        </div>
      </div>
    </Fragment>
  )
})
