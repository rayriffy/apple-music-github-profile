import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Fragment } from 'react'

import '../styles/tailwind.css'

const App: NextPage<AppProps> = props => {
  const { Component, pageProps } = props

  return (
    <Fragment>
      <Head>
        <title>Apple Music GitHub Profile</title>
      </Head>
      <main className="my-8 space-y-6 max-w-xl mx-auto px-4">
        <section>
          <h1 className="font-semibold text-2xl text-gray-900">
            Apple Music GitHub profile
          </h1>
          <p className="text-gray-700">
            Displaying your recently played on your Apple Music to GitHub
            profile (i.e. GitHub markdown)
          </p>
        </section>
        <Component {...pageProps} />
      </main>
    </Fragment>
  )
}

export default App
