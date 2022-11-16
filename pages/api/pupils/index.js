import { getSession } from "next-auth/react"
import Pupil from "../../../models/Pupil"
import db from "../../../utils/db"

const handler = async (req, res) => {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).send("signin required")
  }

  const { user } = session
  await db.connect()
  const newPupil = new Pupil({
    ...req.body,
    user: user._id,
  })

  const pupil = await newPupil.save()
  res.status(201).send(pupil)
}
export default handler
