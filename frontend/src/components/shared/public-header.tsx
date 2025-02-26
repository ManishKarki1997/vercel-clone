import React from 'react'
import { Button } from '../ui/button'
import { RocketIcon } from 'lucide-react'
import { Link } from 'react-router'

function PublicHeader() {
  return (
    <header className="flex justify-between container mx-auto p-4 overflow-hidden md:rounded-lg">
      <Link to="/" className="flex items-center gap-2">
        <h1 className="text-3xl font-medium">
          <span className='font-bold text-primary -mr-1 underline'>Deploy</span> Vite
        </h1>
        <RocketIcon className='text-green-500' />
      </Link>

      <Link to={'/login'}>
        <Button>
          Get Started
        </Button>
      </Link>
    </header >
  )
}

export default PublicHeader