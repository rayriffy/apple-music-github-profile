import type { ReactNode } from 'react'

import '../styles/tailwind.css'

export const metadata = {
  title: 'Apple Music GitHub Profile',
  description:
    'Display your recently played music on your Apple Music to GitHub profile (or anywhere else!)',
}

interface Props {
  children: ReactNode
}

const Layout = async (props: Props) => {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <div className="flex h-full min-h-screen w-full flex-col items-center justify-center p-4">
          <main className="max-h-full w-full max-w-lg overflow-y-auto rounded-xl bg-white px-6 py-6 shadow-xl">
            {children}
          </main>
          <span className="pt-6 text-sm">
            © {new Date().getFullYear()} Phumrapee Limpianchop
          </span>
        </div>
      </body>
    </html>
  )
}

export default Layout
