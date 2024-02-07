'use client'

import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { signIn } from 'next-auth/react'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { Button } from '../ui/button'

export default function Social() {
  const onClick = (provider: 'github' | 'google') => {
    signIn(provider, {
      callBackUrl: DEFAULT_LOGIN_REDIRECT
    })
  }

  return (
    <div className='flex items-center w-full gap-x-2'>
      <Button
        variant='outline'
        size='lg'
        className='w-full'
        onClick={() => onClick('google')}
      >
        <FcGoogle size={24} />
      </Button>
      <Button
        variant='outline'
        size='lg'
        className='w-full'
        onClick={() => onClick('github')}
      >
        <FaGithub size={24} />
      </Button>
    </div>
  )
}
