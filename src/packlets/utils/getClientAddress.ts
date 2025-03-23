export const getClientAddress = (
  headers: Record<string, string | undefined>
) => {
  return (
    headers['cf-connecting-ip'] ??
    headers['x-real-ip'] ??
    headers['x-forwarded-for'] ??
    null
  )
}
