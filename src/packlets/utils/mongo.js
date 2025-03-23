import { MongoClient } from 'mongodb'
const { MONGODB_URL = 'mongodb://johndoe:randompassword@localhost' } =
  process.env
export const mongo = global.mongo || new MongoClient(MONGODB_URL)
if (process.env.NODE_ENV !== 'production') global.mongo = mongo
const db = mongo.db('production')
export const collections = {
  users: db.collection('users'),
  logs: db.collection('logs'),
}
