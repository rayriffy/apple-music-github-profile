import { NextResponse } from 'next/server'

import { getMusicKitDeveloperToken } from '$core/services/getMusicKitDeveloperToken'

export const GET = () => {
  const token = getMusicKitDeveloperToken()

  return NextResponse.json(
    {
      message: 'ok',
      data: token,
    },
    {
      headers: {
        'Cache-Control': `public, max-age=${60 * 59}, s-maxage=${60 * 59}`,
      },
    }
  )
}
