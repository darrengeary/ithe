import { getSession } from "next-auth/react"
import Term from "../../../../../models/Term"
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
  const term = await Term.findById(req.query.id)
  await db.disconnect()
  res.send(term)
}
const putHandler = async (req, res) => {
  await db.connect()
  const term = await Term.findById(req.query.id)
  if (term) {
    console.log(term)
    term.startDate = new Date(req.body.startDate)
    await term.save()
    await db.disconnect()
    res.send({ message: "Term updated successfully" })
  } else {
    await db.disconnect()
    res.status(404).send({ message: "Term not found" })
  }
}
const deleteHandler = async (req, res) => {
  await db.connect()
  const term = await Term.findById(req.query.id)
  if (term) {
    await term.remove()
    await db.disconnect()
    res.send({ message: "Term deleted successfully" })
  } else {
    await db.disconnect()
    res.status(404).send({ message: "Term not found" })
  }
}
export default handler
