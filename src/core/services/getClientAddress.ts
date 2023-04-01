import { headers } from 'next/headers'

export const getClientAddress = (): string | null => {
  const headersList = headers()

  return (
    headersList.get('cf-connecting-ip') ??
    headersList.get('x-real-ip') ??
    headersList.get('x-forwarded-for') ??
    null
  )
}
