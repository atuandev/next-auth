'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { newPassword } from '@/actions/new-password'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { NewPasswordSchema } from '@/schemas'
import FormError from '../form-error'
import FormSuccess from '../form-success'
import { Button } from '../ui/button'
import { PasswordInput } from '../ui/password-input'
import CardWrapper from './card-wrapper'

export default function NewPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')

  const [isSpending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: ''
    }
  })

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      newPassword(values, token).then(res => {
        setError(res?.error)
        setSuccess(res?.success)
      })
    })
  }

  return (
    <CardWrapper
      headerLabel='Enter new password'
      backButtonLabel='Back to login.'
      backButtonHref='/auth/login'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isSpending} type='submit' className='w-full'>
            Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
