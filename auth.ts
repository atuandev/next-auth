import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'

import authConfig from '@/auth.config'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'
import { getUserById } from '@/data/user'
import { getTwoFactorConfirmationByUserId } from './data/two-factor-confirmation'
import { getAccountById } from './data/account'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth providers to sign in
      if (account?.provider !== 'credentials') return true

      // Credentials provider
      if (!user || !user.id) return false

      const existingUser = await getUserById(user.id)

      // Prevent sign in if the email is not verified
      // if (!existingUser || !existingUser.emailVerified) return false

      if (!existingUser) return false

      // Prevent sign in if two-factor is enabled
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        )

        if (!twoFactorConfirmation) return false

        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }
        })
      }

      return true
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }

      if (session.user && token.role) {
        session.user.role = token.role as UserRole
      }

      if (session.user && token.email) {
        session.user.email = token.email
      }

      if (session.user) {
        session.user.name = token.name
        session.user.isOAuth = token.isOAuth as boolean
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
      }

      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      const existingAccount = await getAccountById(existingUser.id)

      token.isOAuth = !!existingAccount

      token.name = existingUser.name
      token.email = existingUser.email
      token.role = existingUser.role
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled

      return token
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig
})
