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
        <div className="min-h-screen h-full w-full flex justify-center items-center flex-col px-4">
          <main className="max-w-lg w-full bg-white px-6 py-6 rounded-xl shadow-xl">
            {children}
          </main>
          <span className="text-sm pt-6">
            © {new Date().getFullYear()} Phumrapee Limpianchop
          </span>
        </div>
      </body>
    </html>
  )
}

export default Layout
