import cbor from 'cbor'

export const COSEECDHAtoPKCS = (COSEPublicKey: Buffer) => {
  /* 
     +------+-------+-------+---------+----------------------------------+
     | name | key   | label | type    | description                      |
     |      | type  |       |         |                                  |
     +------+-------+-------+---------+----------------------------------+
     | crv  | 2     | -1    | int /   | EC Curve identifier - Taken from |
     |      |       |       | tstr    | the COSE Curves registry         |
     |      |       |       |         |                                  |
     | x    | 2     | -2    | bstr    | X Coordinate                     |
     |      |       |       |         |                                  |
     | y    | 2     | -3    | bstr /  | Y Coordinate                     |
     |      |       |       | bool    |                                  |
     |      |       |       |         |                                  |
     | d    | 2     | -4    | bstr    | Private key                      |
     +------+-------+-------+---------+----------------------------------+
  */

  let coseStruct = cbor.decodeAllSync(COSEPublicKey)[0]
  let tag = Buffer.from([0x04])
  let x = coseStruct.get(-2)
  let y = coseStruct.get(-3)

  return Buffer.concat([tag, x, y])
}
