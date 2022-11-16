import { getSession } from "next-auth/react"
import Event from "../../../models/Event"
import db from "../../../utils/db"

const handler = async (req, res) => {
  const session = await getSession({ req })
  const { user } = session
  if (!session) {
    return res.status(401).send({ message: "Signin required" })
  }
  await db.connect()
  const lunchs = await Event.find({ user: user._id })
  await db.disconnect()
  res.send(lunchs)
}

export default handler
