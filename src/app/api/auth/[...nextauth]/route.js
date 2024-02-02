import NextAuth from 'next-auth/next'
import KakaoProvider from 'next-auth/providers/kakao'
import { getUser, createUser, loginUser } from '@/apis/users'

const handler = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user: provideUser, account, profile }) {
      const user = await getUser(provideUser.id, account.provider)

      if (user.length === 0) {
        await createUser(provideUser, account)
      }

      await loginUser(provideUser, account)

      return true
    },
    async jwt({ token, user }) {
      return { ...token, ...user }
    },
    async session({ session, token, user }) {
      session.user = token
      return session
    },
  },
})

export { handler as GET, handler as POST }
