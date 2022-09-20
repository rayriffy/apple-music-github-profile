export interface AttestationCredential {
  fmt: 'none' | 'packed' | 'fido-u2f'
  attStmt: {
    alg?: number
    sig?: Buffer
  }
  authData: Buffer
}
