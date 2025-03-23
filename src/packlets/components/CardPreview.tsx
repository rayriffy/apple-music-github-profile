import { Html } from '@elysiajs/html'
import { Theme } from '$types/Theme'

interface Props {
  uid: string
  theme: Theme
  themes: Theme[]
}

export const CardPreview = ({ uid, theme: selectedTheme, themes }: Props) => {
  const imageUrl = `/theme/${selectedTheme}.svg?${new URLSearchParams({
    uid: uid,
  }).toString()}`

  return (
    <div class={'md:flex'}>
      <div
        class={
          'mx-auto mb-6 w-2/3 flex-shrink-0 sm:mx-0 sm:mb-0 sm:w-2/5 aspect-[345/534]'
        }
      >
        <img
          loading="lazy"
          class="overflow-hidden rounded-xl border border-gray-100"
          src={imageUrl}
          width={345}
          height={534}
          alt={'Rendered card'}
        />
      </div>
      <div class="w-full space-y-4 break-all rounded-xl pl-4">
        <div class="join">
          {themes.map(theme => (
            <a
              href={`/dashboard?theme=${theme}`}
              class={`btn btn-sm join-item capitalize ${theme === selectedTheme ? 'btn-neutral' : ''}`}
            >
              {theme}
            </a>
          ))}
        </div>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Markdown content</legend>
          <textarea rows="8" class="textarea font-mono" name="comment" readonly>
            [![Apple Music GitHub profile](https://music-profile.rayriffy.com
            {imageUrl})](https://music-profile.rayriffy.com)
          </textarea>
        </fieldset>
      </div>
    </div>
  )
}
