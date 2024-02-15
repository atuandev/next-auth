'use client'

import { resetPassword } from '@/actions/resetPassword'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { ResetSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import FormError from '../form-error'
import FormSuccess from '../form-success'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { LoadingSpinner } from '../ui/loading-spinner'
import CardWrapper from './card-wrapper'

export default function ResetForm() {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isSpending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = (data: z.infer<typeof ResetSchema>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      resetPassword(data).then(res => {
        setError(res?.error)
        setSuccess(res?.success)
      })
    })
  }

  return (
    <CardWrapper
      headerLabel='Forgot your password?'
      backButtonLabel='Back to login.'
      backButtonHref='/auth/login'
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
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isSpending} type='submit' className='w-full'>
            {isSpending ? <LoadingSpinner /> : 'Send reset email'}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
