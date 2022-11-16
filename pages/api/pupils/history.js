import { getSession } from "next-auth/react"
import Pupil from "../../../models/Pupil"
import db from "../../../utils/db"

const handler = async (req, res) => {
  const session = await getSession({ req })
  const { user } = session
  if (!session) {
    return res.status(401).send({ message: "Signin required" })
  }
  await db.connect()
  const pupils = await Pupil.find({ user: user._id })
  await db.disconnect()
  res.send(pupils)
}

export default handler
