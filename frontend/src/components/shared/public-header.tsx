import React from 'react'
import { Button } from '../ui/button'
import { RocketIcon } from 'lucide-react'

function PublicHeader() {
  return (
    <header className="flex justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-medium">
          <span className='font-bold text-primary'>Deploy</span> Vite
        </h1>
        <RocketIcon className='text-green-500' />
      </div>

      <Button>
        Get Started
      </Button>
    </header >
  )
}

export default PublicHeader