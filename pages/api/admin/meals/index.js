import { getSession } from "next-auth/react"
import Meal from "../../../../models/Meal"
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
  const newMeal = new Meal({
    name: "Meal",
  })

  const meal = await newMeal.save()
  await db.disconnect()
  res.send({ message: "Meal created successfully", meal })
}
const getHandler = async (req, res) => {
  await db.connect()
  const meals = await Meal.find({})
  await db.disconnect()
  res.send(meals)
}
export default handler
