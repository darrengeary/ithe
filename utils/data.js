import bcrypt from "bcryptjs"

const data = {
  users: [
    {
      name: "John",
      email: "admin@example.com",
      password: bcrypt.hashSync("123456"),
      isTeacher: false,
      isCaterer: true,
    },
    {
      name: "Teacher",
      email: "teacher@example.com",
      password: bcrypt.hashSync("123456"),
      isTeacher: true,
      isCaterer: false,
    },
    {
      name: "Jane",
      email: "user@example.com",
      password: bcrypt.hashSync("123456"),
      isCaterer: false,
      isTeacher: false,
    },
  ],
}

export default data
