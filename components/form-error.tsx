import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface FormErrorProps {
  message?: string;
}

export default function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className='flex items-center space-x-3 text-destructive text-sm bg-destructive/15 p-3 rounded-md'>
      <ExclamationTriangleIcon className='size-5' />
      <span>{message}</span>
    </div>
  );
}
