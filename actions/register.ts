'use server'

import { z } from 'zod'
import bcrypt from 'bcryptjs'

import { db } from '@/lib/db'
import { RegisterSchema } from '@/schemas'
import { getUserByEmail } from '@/data/user'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'
import { redirect } from 'next/navigation'

export const register = async (data: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(data)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { name, email, password } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return { error: 'Email already exists!' }
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  // const verificationToken = await generateVerificationToken(email)
  // await sendVerificationEmail(verificationToken.email, verificationToken.token)

  return {
    success: 'Create account successfully! Please login!'
  }
}
