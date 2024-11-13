import NextAuth from "next-auth"
// import GoogleProvider from "next-auth/providers/google";
// import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import bcrypt from "bcryptjs"
import User from "./models/user"
import { LoginSchema } from "./schema/auth/loginSchema"
import { dbConnect } from "./lib/mongo"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials)

        if (!validatedFields.success) {
          return null
        }

        const { email, password } = validatedFields.data

        await dbConnect()

        try {
          const user = await User.findOne({
            email: email,
          })
          // .populate({
          //   path: "roleId",
          //   populate: {
          //     path: "permissions",
          //     model: "Permission",
          //   },
          // })

          if (user && bcrypt.compareSync(password || "", user.password)) {
            return {
              id: user._id.toString(),
              username: user.username,
              email: user.email,
              // role: user.roleId?.name,
              // permissions: user.roleId?.permissions.map((p: any) => p.key),
              permissions: ["products.view", "products.create", "users.view"],
            }
          }
        } catch (error) {
          throw new Error(error)
        }

        return null
      },
    }),
    // GoogleProvider({
    //     clientId: process.env.GOOGLE_CLIENT_ID,
    //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //     authorization: {
    //         params: {
    //             prompt: "consent",
    //             access_type: "offline",
    //             response_type: "code",
    //         },
    //     },
    // }),
    // GitHubProvider({
    //     clientId: process.env.GITHUB_CLIENT_ID,
    //     clientSecret: process.env.GITHUB_CLIENT_SECRET,
    //     authorization: {
    //         params: {
    //             prompt: "consent",
    //             access_type: "offline",
    //             response_type: "code",
    //         },
    //     },
    // }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username
        // token.role = user.role
        token.permissions = user.permissions
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        username: token.username,
        // role: token.role,
        permissions: token.permissions,
      }
      return session
    },
  },
})
