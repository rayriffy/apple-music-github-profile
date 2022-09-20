import crypto from 'crypto'

// verify signature from signature, data, and PEM key
export const verifySignature = (
  signature: Buffer,
  data: Buffer,
  publicKey: string
) => crypto.createVerify('SHA256').update(data).verify(publicKey, signature)
