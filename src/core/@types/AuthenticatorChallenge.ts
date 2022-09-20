export interface AuthenticatorChallenge {
  rp: {
    name: string
    id: string
  }
  uid: string
  challenge: string
}
