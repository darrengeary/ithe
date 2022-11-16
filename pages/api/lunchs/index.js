import { getSession } from "next-auth/react"
import Event from "../../../models/Event"
import db from "../../../utils/db"

const handler = async (req, res) => {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).send("signin required")
  }

  const { user } = session
  await db.connect()
  const newLunch = new Event({
    ...req.body,
    user: user._id,
  })

  const lunch = await newLunch.save()
  res.status(201).send(lunch)
}
export default handler
