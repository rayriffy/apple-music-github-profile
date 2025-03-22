import { headers } from 'next/headers'

export const getClientAddress = async (): Promise<string | null> => {
  const headersList = await headers()

  return (
    headersList.get('cf-connecting-ip') ??
    headersList.get('x-real-ip') ??
    headersList.get('x-forwarded-for') ??
    null
  )
}
