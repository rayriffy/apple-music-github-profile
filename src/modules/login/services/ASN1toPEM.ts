// Convert binary certificate or public key to an OpenSSL-compatible PEM text format
export const ASN1toPEM = (asn1: Buffer) => {
  if (!Buffer.isBuffer(asn1))
    throw new Error('ASN1toPEM: pkBuffer must be Buffer.')

  let type
  if (asn1.length == 65 && asn1[0] == 0x04) {
    /*
          If needed, we encode rawpublic key to ASN structure, adding metadata:
          SEQUENCE {
            SEQUENCE {
               OBJECTIDENTIFIER 1.2.840.10045.2.1 (ecPublicKey)
               OBJECTIDENTIFIER 1.2.840.10045.3.1.7 (P-256)
            }
            BITSTRING <raw public key>
          }
          Luckily, to do that, we just need to prefix it with constant 26 bytes (metadata is constant).
      */

    asn1 = Buffer.concat([
      Buffer.from(
        '3059301306072a8648ce3d020106082a8648ce3d030107034200',
        'hex'
      ),
      asn1,
    ])

    type = 'PUBLIC KEY'
  } else {
    type = 'CERTIFICATE'
  }

  let b64cert = asn1.toString('base64')

  let PEMKey = ''
  for (let i = 0; i < Math.ceil(b64cert.length / 64); i++) {
    let start = 64 * i

    PEMKey += b64cert.substr(start, 64) + '\n'
  }

  PEMKey = `-----BEGIN ${type}-----\n` + PEMKey + `-----END ${type}-----\n`

  return PEMKey
}
