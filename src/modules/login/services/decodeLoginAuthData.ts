export const decodeLoginAuthData = (buffer: Buffer) => {
  let rpIdHash = buffer.slice(0, 32)
  buffer = buffer.slice(32)
  let flagsBuf = buffer.slice(0, 1)
  buffer = buffer.slice(1)
  let flags = flagsBuf[0]
  let counterBuf = buffer.slice(0, 4)
  buffer = buffer.slice(4)
  let counter = counterBuf.readUInt32BE(0)

  return { rpIdHash, flagsBuf, flags, counter, counterBuf }
}
