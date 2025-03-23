import { Html } from '@elysiajs/html'
export const CardPreview = ({ uid, theme: selectedTheme, themes }) => {
  const imageUrl = `/theme/${selectedTheme}.svg?${new URLSearchParams({
    uid: uid,
  }).toString()}`
  return Html.createElement(
    'div',
    { class: 'md:flex' },
    Html.createElement(
      'div',
      {
        class:
          'mx-auto mb-6 w-2/3 flex-shrink-0 sm:mx-0 sm:mb-0 sm:w-2/5 aspect-[345/534]',
      },
      Html.createElement('img', {
        loading: 'lazy',
        class: 'overflow-hidden rounded-xl border border-gray-100',
        src: imageUrl,
        width: 345,
        height: 534,
        alt: 'Rendered card',
      })
    ),
    Html.createElement(
      'div',
      { class: 'w-full space-y-4 break-all rounded-xl pl-4' },
      Html.createElement(
        'div',
        { class: 'join' },
        themes.map(theme =>
          Html.createElement(
            'a',
            {
              href: `/dashboard?theme=${theme}`,
              class: `btn btn-sm join-item capitalize ${theme === selectedTheme ? 'btn-neutral' : ''}`,
            },
            theme
          )
        )
      ),
      Html.createElement(
        'fieldset',
        { class: 'fieldset' },
        Html.createElement(
          'legend',
          { class: 'fieldset-legend' },
          'Markdown content'
        ),
        Html.createElement(
          'textarea',
          {
            rows: '8',
            class: 'textarea font-mono',
            name: 'comment',
            readonly: true,
          },
          '[![Apple Music GitHub profile](https://music-profile.rayriffy.com',
          imageUrl,
          ')](https://music-profile.rayriffy.com)'
        )
      )
    )
  )
}
