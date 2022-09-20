import { encode } from 'base64-arraybuffer'

export const encodeBase64 = (input: ArrayBuffer): string => {
  return encode(input)
}
