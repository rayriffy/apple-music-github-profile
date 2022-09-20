export interface LoginRequest {
  id: string
  response: {
    authenticatorData: string
    clientDataJSON: string
    signature: string
  }
}
