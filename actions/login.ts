'use server'

import { z } from 'zod'
import { AuthError } from 'next-auth'

import { signIn } from '@/auth'
import { getUserByEmail } from '@/data/user'
import { sendTwoFactorTokenEmail, sendVerificationEmail } from '@/lib/mail'
import { generateTwoFactorToken, generateVerificationToken } from '@/lib/tokens'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { LoginSchema } from '@/schemas'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token'
import { getTwoFactorConfirmationByUserId } from './../data/two-factor-confirmation'
import { db } from '@/lib/db'

export const login = async (data: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(data)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { email, password, code } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.password || !existingUser.email) {
    return { error: 'Email does not exist!' }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    )

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    )

    return { success: 'Confirmation email sent! Please verify your email.' }
  }

  if (existingUser.isTwoFactorEnabled) {
    if (code) {
      // Verify two factor code
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)

      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { error: 'Invalid two factor code!' }
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date()

      if (hasExpired) {
        return { error: 'Two factor code has expired!' }
      }

      await db.twoFactorToken.delete({ where: { id: twoFactorToken.id } })

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      )

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingUser.id }
        })
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id
        }
      })
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)

      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)

      return { twoFactor: true }
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials!' }
        default:
          return { error: 'Something went wrong!' }
      }
    }

    throw error
  }
}
