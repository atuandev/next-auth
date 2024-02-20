'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { settings } from '@/actions/settings'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SettingsSchema } from '@/schemas'
import FormError from '@/components/form-error'
import FormSuccess from '@/components/form-success'
import useCurrentUser from '@/hooks/use-current-user'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function SettingsPage() {
  const user = useCurrentUser()

  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const { update } = useSession()
  const [isSpending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || ''
    }
  })

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      settings(values)
        .then(data => {
          if (data.error) {
            setError(data.error)
          }

          if (data.success) {
            setSuccess(data.success)
            update()
          }
        })
        .catch(() => setError('Something went wrong!'))
    })
  }

  return (
    <Card className='w-[600px]'>
      <CardHeader className='text-2xl font-semibold text-center'>
        Settings
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isSpending}
                        placeholder='Anh Tuan'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type='submit' disabled={isSpending}>
              {isSpending ? <LoadingSpinner /> : 'Save'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
