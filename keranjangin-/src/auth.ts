import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // TODO: Replace this with your actual database lookup logic
        const user = { id: "1", name: "Test User", email: "test@example.com" }

        // Give a clear demonstration user log in
        if (credentials?.username === "admin" && credentials?.password === "password") {
          return user
        } else {
          return null
        }
      }
    })
  ],
})
