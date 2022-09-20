export const decodeRegisterAuthData = (buffer: Buffer) => {
  let rpIdHash = buffer.slice(0, 32)
  buffer = buffer.slice(32)
  let flagsBuf = buffer.slice(0, 1)
  buffer = buffer.slice(1)
  let flags = flagsBuf[0]
  let counterBuf = buffer.slice(0, 4)
  buffer = buffer.slice(4)
  let counter = counterBuf.readUInt32BE(0)
  let aaguid = buffer.slice(0, 16)
  buffer = buffer.slice(16)
  let credIDLenBuf = buffer.slice(0, 2)
  buffer = buffer.slice(2)
  let credIDLen = credIDLenBuf.readUInt16BE(0)
  let credID = buffer.slice(0, credIDLen)
  buffer = buffer.slice(credIDLen)
  let COSEPublicKey = buffer

  return {
    rpIdHash,
    flagsBuf,
    flags,
    counter,
    counterBuf,
    aaguid,
    credID,
    COSEPublicKey,
  }
}
