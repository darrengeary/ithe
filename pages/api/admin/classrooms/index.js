import { getSession } from "next-auth/react"
import Classroom from "../../../../models/Classroom"
import School from "../../../../models/School"
import db from "../../../../utils/db"

const handler = async (req, res) => {
  const session = await getSession({ req })
  if (!session || !session.user.isCaterer) {
    return res.status(401).send("admin signin required")
  }
  // const { user } = session;
  if (req.method === "GET") {
    return getHandler(req, res)
  } else if (req.method === "POST") {
    return postHandler(req, res)
  } else {
    return res.status(400).send({ message: "Method not allowed" })
  }
}
const postHandler = async (req, res) => {
  await db.connect()
  const newClassroom = new Classroom({
    school: await School.findById(req.body.params.schoolId),
  })
  const classroom = await newClassroom.save()
  await db.disconnect()
  res.send({
    message: "Classroom created successfully",
    classroom,
  })
}
const getHandler = async (req, res) => {
  await db.connect()
  const classrooms = await Classroom.find({
    school: await School.findById(req.query.schoolId),
  })
  await db.disconnect()
  res.send(classrooms)
}
export default handler
