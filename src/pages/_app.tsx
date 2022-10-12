import { Fragment } from 'react'

import Head from 'next/head'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

import { FaGithub } from 'react-icons/fa'

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
      <footer className="text-center text-gray-600 py-6 space-y-2">
        <div className="flex justify-center">
          <a
            href="https://github.com/rayriffy/apple-music-github-profile"
            target="_blank"
            rel="noopener noreferer"
          >
            <FaGithub className="w-6 h-6" />
          </a>
        </div>
        <p className="text-sm">
          © {new Date().getFullYear()} Phumrapee Limpianchop
        </p>
      </footer>
    </Fragment>
  )
}

export default App
