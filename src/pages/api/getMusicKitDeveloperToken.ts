import type { NextApiHandler } from "next";
import { getMusicKitDeveloperToken } from "../../core/services/getMusicKitDeveloperToken";

const api: NextApiHandler = (req, res) => {
  const token = getMusicKitDeveloperToken()

  res.setHeader('Cache-Control', `public, maxage=${60 * 59}`) // 1 hour
  return res.send({
    message: 'ok',
    data: token
  })
}

export default api
