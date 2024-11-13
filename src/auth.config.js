export const authConfig = {
  session: {
   strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [],
}