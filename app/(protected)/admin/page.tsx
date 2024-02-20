'use client'

import { admin } from '@/actions/admin'
import { RoleGate } from '@/components/auth/role-gate'
import FormSuccess from '@/components/form-success'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { UserRole } from '@prisma/client'
import { toast } from 'sonner'

export default function AdminPage() {
  const onServerActionClick = () => {
    admin().then(res => {
      if (res.error) toast.error(res.error)
      if (res.success) toast.success(res.success)
    })
  }

  const onApiRouteClick = () => {
    fetch('/api/admin').then(res => {
      if (res.ok) {
        toast.success('Allowed to access API route!')
      } else {
        toast.error('Forbidden allowed to access API route!')
      }
    })
  }

  return (
    <Card className='w-[600px] shadow-md'>
      <CardHeader>
        <p className='text-xl font-semibold text-center'>Admin</p>
      </CardHeader>
      <CardContent className='space-y-4'>
        <RoleGate allowedRoles={UserRole.ADMIN}>
          <FormSuccess message='You are allowed to see this content!' />
        </RoleGate>

        <div className='flex items-center justify-between border rounded-lg p-3 shadow-sm'>
          <p className='text-sm font-medium'>Admin-only API Route</p>
          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>

        <div className='flex items-center justify-between border rounded-lg p-3 shadow-sm'>
          <p className='text-sm font-medium'>Admin-only Server Action</p>
          <Button onClick={onServerActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  )
}
