import { cn } from '@/lib/utils'
import React from 'react'

function AppContainer({
  children,
  className

}: {
  children: React.ReactNode | React.ReactNode[],
  className?: string

}) {
  return (
    <div className={cn('container mx-auto', className)}>
      {children}
    </div>
  )
}

export default AppContainer