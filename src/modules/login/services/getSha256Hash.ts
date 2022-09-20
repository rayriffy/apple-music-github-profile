import crypto from 'crypto'

export const getSha256Hash = (buffer: Buffer) =>
  crypto.createHash('SHA256').update(buffer).digest()
