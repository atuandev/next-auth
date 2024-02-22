import { db } from '@/lib/db'

export const getAccountById = async (userId: string) => {
  try {
    return await db.account.findFirst({
      where: { userId }
    })
  } catch (error) {
    return null
  }
}
