// /api/pupils/:id
import { getSession } from "next-auth/react"
import Pupil from "../../../../models/Pupil"
import db from "../../../../utils/db"

const handler = async (req, res) => {
  const session = await getSession({ req })
  const { user } = session
  await db.connect()
  const pupil = await Pupil.findById(req.query.id)
  if (!session || pupil.user.valueOf() != user._id) {
    return res.status(401).send("Signin Required")
  }
  await db.disconnect()
  res.send(pupil)
}

export default handler
