import { Html } from '@elysiajs/html'

interface Props {
  children: JSX.Element | JSX.Element[]
}

export const Base = ({ children }: Props) => {
  return (
    <html
      lang="en"
      className="bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100"
    >
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link
          href="https://cdn.jsdelivr.net/npm/daisyui@5"
          rel="stylesheet"
          type="text/css"
        />
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

        <title>Apple Music GitHub Profile</title>
        <meta
          name="description"
          content="Display your recently played music on your Apple Music to GitHub profile (or anywhere else!)"
        />
      </head>
      <body>
        <main
          className={
            'w-screen md:h-[100dvh] flex md:items-center md:justify-center p-4 md:p-0'
          }
        >
          {children}
        </main>
      </body>
    </html>
  )
}
