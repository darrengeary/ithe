import { getSession } from "next-auth/react"
import Classroom from "../../../../../models/Classroom"
import db from "../../../../../utils/db"

const handler = async (req, res) => {
  const session = await getSession({ req })
  if (!session || (session && !session.user.isCaterer)) {
    return res.status(401).send("signin required")
  }

  const { user } = session
  if (req.method === "GET") {
    return getHandler(req, res, user)
  } else if (req.method === "PUT") {
    return putHandler(req, res, user)
  } else if (req.method === "DELETE") {
    return deleteHandler(req, res, user)
  } else {
    return res.status(400).send({ message: "Method not allowed" })
  }
}
const getHandler = async (req, res) => {
  await db.connect()
  const classroom = await Classroom.findById(req.query.id)
  await db.disconnect()
  res.send(classroom)
}
const putHandler = async (req, res) => {
  await db.connect()
  const classroom = await Classroom.findById(req.query.id)
  if (classroom) {
    classroom.name = req.body.name
    classroom.totalPupils = req.body.totalPupils
    await classroom.save()
    await db.disconnect()
    res.send({ message: "Classroom updated successfully" })
  } else {
    await db.disconnect()
    res.status(404).send({ message: "Classroom not found" })
  }
}
const deleteHandler = async (req, res) => {
  await db.connect()
  const classroom = await Classroom.findById(req.query.id)
  if (classroom) {
    await classroom.remove()
    await db.disconnect()
    res.send({ message: "Classroom deleted successfully" })
  } else {
    await db.disconnect()
    res.status(404).send({ message: "Classroom not found" })
  }
}
export default handler
