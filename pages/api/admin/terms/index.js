import { getSession } from "next-auth/react"
import Term from "../../../../models/Term"
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
  const newTerm = new Term({
    school: await School.findById(req.body.params.schoolId),
    startDate: new Date(2018, 11, 24),
  })
  console.log(newTerm)
  const term = await newTerm.save()
  await db.disconnect()
  res.send({
    message: "Term created successfully",
    term,
  })
}
const getHandler = async (req, res) => {
  await db.connect()
  const terms = await Term.find({
    school: await School.findById(req.query.schoolId),
  })
  await db.disconnect()
  res.send(terms)
}
export default handler
