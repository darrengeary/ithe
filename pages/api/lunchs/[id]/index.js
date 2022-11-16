// /api/lunchs/:id
import { getSession } from "next-auth/react"
import Event from "../../../../models/Event"
import db from "../../../../utils/db"

const handler = async (req, res) => {
  const session = await getSession({ req })
  const { user } = session
  await db.connect()
  const lunch = await Event.findById(req.query.id)
  if (!session || lunch.user.valueOf() != user._id) {
    return res.status(401).send("Signin Required")
  }
  await db.disconnect()
  res.send(lunch)
}

export default handler
