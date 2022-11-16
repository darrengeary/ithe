import { getSession } from "next-auth/react"
import Holiday from "../../../../../models/Holiday"
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
  const holiday = await Holiday.findById(req.query.id)
  await db.disconnect()
  res.send(holiday)
}
const putHandler = async (req, res) => {
  await db.connect()
  const holiday = await Holiday.findById(req.query.id)
  if (holiday) {
    console.log(holiday)
    holiday.startDate = new Date(req.body.startDate)
    await holiday.save()
    await db.disconnect()
    res.send({ message: "Holiday updated successfully" })
  } else {
    await db.disconnect()
    res.status(404).send({ message: "Holiday not found" })
  }
}
const deleteHandler = async (req, res) => {
  await db.connect()
  const holiday = await Holiday.findById(req.query.id)
  if (holiday) {
    await holiday.remove()
    await db.disconnect()
    res.send({ message: "Holiday deleted successfully" })
  } else {
    await db.disconnect()
    res.status(404).send({ message: "Holiday not found" })
  }
}
export default handler
