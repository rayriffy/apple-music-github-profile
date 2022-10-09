import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Page: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      router.push('/')
    }, 1000)
  }, [])

  return (
    <section className="py-6 px-8 bg-gray-50 rounded-lg border shadow-lg">
      <h1>
        <b>Authenticated!</b> Redirecting...
      </h1>
    </section>
  )
}

export default Page
