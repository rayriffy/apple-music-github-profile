export interface User {
  uid: string
  email: string
  clientAddress: string | null

  token: {
    refresh: string
    music: string | null
  }

  createdAt: Date
  updatedAt: Date
  lastSeenAt: Date | null
}
