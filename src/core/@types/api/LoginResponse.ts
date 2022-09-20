export interface LoginResponse {
  challenge: string
  allowedCredentials: {
    type: PublicKeyCredentialType
    id: string
  }[]
}
