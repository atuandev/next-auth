import { auth, signOut } from '@/auth'

export default async function SettingsPage() {
  const session = await auth()

  return (
    <div>
      Settings page: {JSON.stringify(session)}
      <form
        action={async () => {
          'use server'

          await signOut()
        }}
      >
        <button type='submit' className='bg-gray-700 text-white p-2 rounded-md'>Sign out</button>
      </form>
    </div>
  )
}
