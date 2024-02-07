import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import CardWrapper from './card-wrapper'

export default function ErrorCard() {
  return (
    <CardWrapper
      headerLabel='Oops! Something went wrong'
      backButtonLabel='Back to login'
      backButtonHref='/auth/login'
    >
      <div className='w-full flex justify-center items-center'>
        <ExclamationTriangleIcon className='size-7 text-red-500' />
      </div>
    </CardWrapper>
  )
}
