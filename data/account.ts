import { db } from '@/lib/db'

export const getAccountById = async (id: string) => {
  try {
    return await db.account.findFirst({
      where: { id }
    })
  } catch (error) {
    return null
  }
}
