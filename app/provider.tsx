import { auth } from '@/auth'
import { SessionProvider } from 'next-auth/react'

export default async function Provider({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return <SessionProvider session={session}>{children}</SessionProvider>
}
