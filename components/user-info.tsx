import { ExtendedUser } from '@/next-auth'
import { Card, CardContent, CardHeader } from './ui/card'
import { Badge } from './ui/badge'

interface UserInfoProps {
  user?: ExtendedUser
  label: string
}

export default async function UserInfo({ user, label }: UserInfoProps) {
  return (
    <Card className='w-[600px] shadow-md'>
      <CardHeader>
        <p className='text-xl font-semibold text-center'>{label}</p>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='flex items-center justify-between border rounded-lg p-3 shadow-sm'>
          <p className='text-sm font-medium'>ID</p>
          <p className='truncate max-w-[150px] text-xs font-mono px-2 py-1 bg-slate-100 rounded-md'>
            {user?.id}
          </p>
        </div>
        <div className='flex items-center justify-between border rounded-lg p-3 shadow-sm'>
          <p className='text-sm font-medium'>Name</p>
          <p className='truncate max-w-[150px] text-xs font-mono px-2 py-1 bg-slate-100 rounded-md'>
            {user?.name}
          </p>
        </div>
        <div className='flex items-center justify-between border rounded-lg p-3 shadow-sm'>
          <p className='text-sm font-medium'>Email</p>
          <p className='truncate max-w-[150px] text-xs font-mono px-2 py-1 bg-slate-100 rounded-md'>
            {user?.email}
          </p>
        </div>
        <div className='flex items-center justify-between border rounded-lg p-3 shadow-sm'>
          <p className='text-sm font-medium'>Role</p>
          <p className='truncate max-w-[150px] text-xs font-mono px-2 py-1 bg-slate-100 rounded-md'>
            {user?.role}
          </p>
        </div>
        <div className='flex items-center justify-between border rounded-lg p-3 shadow-sm'>
          <p className='text-sm font-medium'>Two Factor Authentication</p>
          <Badge variant={user?.isTwoFactorEnabled ? 'success' : 'destructive'}>
            {user?.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
