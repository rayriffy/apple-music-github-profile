import { Html } from '@elysiajs/html'
import type { Theme } from '$types/Theme'

interface Props {
  uid: string
  theme: Theme
  themes: Theme[]
}

export const CardPreview = ({ uid, theme: selectedTheme, themes }: Props) => {
  const imageUrl = `/theme/${selectedTheme}.svg?${new URLSearchParams({
    uid: uid,
  }).toString()}`

  const clientScript = `
    document.getElementById('select-feild').addEventListener('change', function (e) {
      const selectedOption = e.target.options[e.target.selectedIndex]
      window.location.href = selectedOption.value
    })
  `

  return (
    <div class={'md:flex gap-4'}>
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
      <div class="w-full space-y-4 break-all rounded-xl">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Theme</legend>
          <select id="select-feild" class="select">
            <option disabled selected>
              Pick a theme
            </option>
            {themes.map(theme => (
              // biome-ignore lint/correctness/useJsxKeyInIterable: Pure JSX does not have interactive elements
              <option
                value={`/dashboard?theme=${theme}`}
                selected={theme === selectedTheme}
              >
                {theme.replace(/(^\w{1})|(\s+\w{1})/g, letter =>
                  letter.toUpperCase()
                )}
              </option>
            ))}
          </select>
          <script>{clientScript}</script>
        </fieldset>
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
