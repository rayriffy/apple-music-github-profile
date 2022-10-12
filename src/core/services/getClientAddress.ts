import type { IncomingHttpHeaders } from 'http'

export const getClientAddress = (headers: IncomingHttpHeaders): string =>
  (headers['cf-connecting-ip'] as string) ??
  (headers['x-real-ip'] as string) ??
  (headers['x-forwarded-for'] as string)
