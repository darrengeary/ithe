import { getSession } from "next-auth/react"
import School from "../../../../models/School"
import Term from "../../../../models/Term"
import Holiday from "../../../../models/Holiday"
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
  const newSchool = new School({
    name: "School",
  })
  const school = await newSchool.save()
  const newTerm1 = new Term({
    name: "First Term",
    startDate: new Date("2022-08-28"),
    endDate: new Date("2022-11-21"),
    school: newSchool,
  })

  const newTerm2 = new Term({
    name: "Second Term",
    startDate: new Date("2023-01-05"),
    endDate: new Date("2023-06-30"),
    school: newSchool,
  })

  const newHoliday1 = new Holiday({
    name: "October Mid Term",
    school: newSchool,
    startDate: new Date("2022-10-31"),
    endDate: new Date("2022-11-04"),
  })

  const newHoliday2 = new Holiday({
    name: "Christmas Holiday",
    school: newSchool,
    startDate: new Date("2022-12-22"),
    endDate: new Date("2023-01-04"),
  })
  const newHoliday3 = new Holiday({
    name: "February Mid Term",
    school: newSchool,
    startDate: new Date("2023-02-16"),
    endDate: new Date("2023-02-17"),
  })
  const newHoliday4 = new Holiday({
    name: "Easter Holiday",
    school: newSchool,
    startDate: new Date("2023-04-03"),
    endDate: new Date("2023-04-14"),
  })
  const newHoliday5 = new Holiday({
    name: "St Brigids Day",
    school: newSchool,
    startDate: new Date("2023-02-06"),
    endDate: new Date("2023-02-06"),
  })
  const newHoliday6 = new Holiday({
    name: "St Patricks Day",
    school: newSchool,
    startDate: new Date("2023-03-17"),
    endDate: new Date("2023-03-17"),
  })
  const newHoliday7 = new Holiday({
    name: "May Bank Holiday",
    school: newSchool,
    startDate: new Date("2023-05-01"),
    endDate: new Date("2023-05-01"),
  })
  const newHoliday8 = new Holiday({
    name: "June Bank Holiday",
    school: newSchool,
    startDate: new Date("2023-06-05"),
    endDate: new Date("2023-06-05"),
  })

  await newTerm1.save()
  await newTerm2.save()
  await newHoliday1.save()
  await newHoliday2.save()
  await newHoliday3.save()
  await newHoliday4.save()
  await newHoliday5.save()
  await newHoliday6.save()
  await newHoliday7.save()
  await newHoliday8.save()
  await db.disconnect()
  res.send({ message: "School created successfully", school })
}
const getHandler = async (req, res) => {
  await db.connect()
  const schools = await School.find({})
  await db.disconnect()
  res.send(schools)
}
export default handler
