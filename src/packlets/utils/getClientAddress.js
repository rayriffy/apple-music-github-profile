export const getClientAddress = headers => {
  return (
    headers['cf-connecting-ip'] ??
    headers['x-real-ip'] ??
    headers['x-forwarded-for'] ??
    null
  )
}
