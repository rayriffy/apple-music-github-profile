import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

import '../styles/tailwind.css'

const App: NextPage<AppProps> = props => {
  const { Component, pageProps } = props

  return (
    <Component {...pageProps} />
  )
}

export default App
