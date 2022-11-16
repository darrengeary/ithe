import { getSession } from "next-auth/react"
import Meal from "../../../../../models/Meal"
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
  const meal = await Meal.findById(req.query.id)
  await db.disconnect()
  res.send(meal)
}
const putHandler = async (req, res) => {
  await db.connect()
  const meal = await Meal.findById(req.query.id)
  if (meal) {
    meal.name = req.body.name
    await meal.save()
    await db.disconnect()
    res.send({ message: "Meal updated successfully" })
  } else {
    await db.disconnect()
    res.status(404).send({ message: "Meal not found" })
  }
}
const deleteHandler = async (req, res) => {
  await db.connect()
  const meal = await Meal.findById(req.query.id)
  if (meal) {
    await meal.remove()
    await db.disconnect()
    res.send({ message: "Meal deleted successfully" })
  } else {
    await db.disconnect()
    res.status(404).send({ message: "Meal not found" })
  }
}
export default handler
