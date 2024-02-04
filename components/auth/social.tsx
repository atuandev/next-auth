'use client';

import { FcGoogle } from 'react-icons/fc';
import { Button } from '../ui/button';
import { FaGithub } from 'react-icons/fa';

export default function Social() {
  return (
    <div className='flex items-center w-full gap-x-2'>
      <Button variant='outline' size='lg' className='w-full' onClick={() => {}}>
        <FcGoogle size={24} />
      </Button>
      <Button variant='outline' size='lg' className='w-full' onClick={() => {}}>
        <FaGithub size={24} />
      </Button>
    </div>
  );
}
