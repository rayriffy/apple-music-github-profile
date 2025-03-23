import { Html } from '@elysiajs/html'
export const Base = ({ children }) => {
  return Html.createElement(
    'html',
    {
      lang: 'en',
      className: 'bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100',
    },
    Html.createElement(
      'head',
      null,
      Html.createElement('meta', { charset: 'UTF-8' }),
      Html.createElement('meta', {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      }),
      Html.createElement('link', {
        href: 'https://cdn.jsdelivr.net/npm/daisyui@5',
        rel: 'stylesheet',
        type: 'text/css',
      }),
      Html.createElement('script', {
        src: 'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4',
      }),
      Html.createElement('title', null, 'Apple Music GitHub Profile'),
      Html.createElement('meta', {
        name: 'description',
        content:
          'Display your recently played music on your Apple Music to GitHub profile (or anywhere else!)',
      })
    ),
    Html.createElement(
      'body',
      null,
      Html.createElement(
        'main',
        { className: 'w-screen h-[100dvh] flex items-center justify-center' },
        children
      )
    )
  )
}
