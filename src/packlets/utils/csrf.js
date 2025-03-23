import CSRF from 'csrf'
export const getCSRFToken = () => {
  const csrfInstance = new CSRF()
  const csrfToken = csrfInstance.create(process.env.CSRF_SECRET)
  return csrfToken
}
export const verifyCSRFToken = token => {
  const csrfInstance = new CSRF()
  const isCSRFVerified = csrfInstance.verify(process.env.CSRF_SECRET, token)
  return isCSRFVerified
}
