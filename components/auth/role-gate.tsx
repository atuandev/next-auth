'use client'

import { useCurrentRole } from '@/hooks/use-current-role'
import { UserRole } from '@prisma/client'
import FormError from '../form-error'

interface RoleGateProps {
  children: React.ReactNode
  allowedRoles: UserRole
}

export function RoleGate({ children, allowedRoles }: RoleGateProps) {
  const role = useCurrentRole()

  if (role !== allowedRoles) {
    return (
      <FormError message='You are not have permission to view this content!' />
    )
  }

  return <>{children}</>
}
