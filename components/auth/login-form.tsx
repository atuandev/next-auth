'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { login } from '@/actions/login'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { LoginSchema } from '@/schemas'
import FormError from '../form-error'
import FormSuccess from '../form-success'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { LoadingSpinner } from '../ui/loading-spinner'
import { PasswordInput } from '../ui/password-input'
import CardWrapper from './card-wrapper'

export default function LoginForm() {
  const searchParams = useSearchParams()
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email is already registered with a different provider!'
      : ''

  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isSpending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      login(data).then(res => {
        setError(res?.error)
        setSuccess(res?.success)
      })
    })
  }

  return (
    <CardWrapper
      headerLabel='Welcome back!'
      backButtonLabel="Don't have an account? Sign up here."
      backButtonHref='/auth/register'
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSpending}
                      placeholder='example@gmail.com'
                      type='email'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      disabled={isSpending}
                      placeholder='******'
                      type='password'
                    />
                  </FormControl>
                  <Button
                    size='sm'
                    variant='link'
                    asChild
                    className='px-0 font-normal'
                  >
                    <Link href='/auth/reset'>Forgot password?</Link>
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button disabled={isSpending} type='submit' className='w-full'>
            {isSpending ? <LoadingSpinner /> : 'Login'}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
