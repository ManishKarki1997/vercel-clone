import { cn } from '@/lib/utils'
import { RocketIcon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router'

function AppLogo({ to, textClass }: { to?: string, textClass?: string }) {
  return (
    <Link to={to || "/"} className="flex items-center gap-2">
      <h1 className={cn("text-3xl font-medium", textClass)}>
        <span className='font-bold text-primary -mr-1 underline'>Deploy</span> Vite
      </h1>
      <RocketIcon className='text-green-500' />
    </Link>
  )
}

export default AppLogo