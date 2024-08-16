import { MongoClient } from 'mongodb'

import { User } from '$core/@types/mongo/User'
import { Log } from '$core/@types/mongo/Log'

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var mongo: MongoClient | undefined
}

const { MONGODB_URL = 'mongodb://johndoe:randompassword@localhost' } =
  process.env

export const mongo = global.mongo || new MongoClient(MONGODB_URL)

if (process.env.NODE_ENV !== 'production') global.mongo = mongo

const db = mongo.db('production')

export const collections = {
  users: db.collection<User>('users'),
  logs: db.collection<Log>('logs'),
}
