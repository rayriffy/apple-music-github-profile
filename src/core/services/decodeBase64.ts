import { decode } from 'base64-arraybuffer'

export const decodeBase64 = (base64String: string): ArrayBuffer => {
  return decode(base64String)
}
