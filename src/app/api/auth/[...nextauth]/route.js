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

      if (!user) {
        await createUser(provideUser, account)
      }

      await loginUser(provideUser, account)

      return true
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.nickname) {
        token.name = session.nickname
      }
      return { ...token, ...user }
    },
    async session({ session, token, trigger, newSession }) {
      const user = await getUser(token.id, 'kakao')

      session.user = {
        id: user.id,
        nickname: user.nickname,
      }

      if (trigger === "update" && newSession?.name) {
        session.name = newSession.name
      }

      return session
    },
  },
})

export { handler as GET, handler as POST }
