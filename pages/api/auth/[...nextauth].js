import bcryptjs from "bcryptjs"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import User from "../../../models/User"
import db from "../../../utils/db"

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) token._id = user._id
      if (user?.isTeacher) token.isTeacher = user.isTeacher
      if (user?.isCaterer) token.isCaterer = user.isCaterer
      return token
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id
      if (token?.isCaterer) session.user.isCaterer = token.isCaterer
      if (token?.isTeacher) session.user.isTeacher = token.isTeacher
      return session
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect()
        const user = await User.findOne({
          email: credentials.email,
        })
        await db.disconnect()
        if (user && bcryptjs.compareSync(credentials.password, user.password)) {
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: "f",
            isTeacher: user.isTeacher,
            isCaterer: user.isCaterer,
          }
        }
        throw new Error("Invalid email or password")
      },
    }),
  ],
})
