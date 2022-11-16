import { getSession } from "next-auth/react"
import School from "../../../../../models/School"
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
  const school = await School.findById(req.query.id)
  await db.disconnect()
  res.send(school)
}
const putHandler = async (req, res) => {
  await db.connect()
  const school = await School.findById(req.query.id)
  if (school) {
    school.name = req.body.name
    await school.save()
    await db.disconnect()
    res.send({ message: "School updated successfully" })
  } else {
    await db.disconnect()
    res.status(404).send({ message: "School not found" })
  }
}
const deleteHandler = async (req, res) => {
  await db.connect()
  const school = await School.findById(req.query.id)
  if (school) {
    await school.remove()
    await db.disconnect()
    res.send({ message: "School deleted successfully" })
  } else {
    await db.disconnect()
    res.status(404).send({ message: "School not found" })
  }
}
export default handler
