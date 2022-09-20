export interface RegisterRequest {
  id: string
  rawId: string
  type: string
  response: {
    attestationObject: string
    clientDataJSON: string
  }
}
