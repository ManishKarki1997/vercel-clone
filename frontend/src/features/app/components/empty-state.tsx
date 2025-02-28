import { cn } from '@/lib/utils'
import React from 'react'

function Header({
  children,
  className
}: {
  children: React.ReactNode | React.ReactNode[],
  className?: string
}) {
  return <div className={cn("", className)}>
    {children}
  </div>
}

function Actions({
  children,
  className
}: {
  children: React.ReactNode | React.ReactNode[],
  className?: string
}) {
  return <div className={cn(" flex flex-col items-center", className)}>
    {children}
  </div>
}

function EmptyState({
  children,
  className
}: {
  children: React.ReactNode | React.ReactNode[],
  className?: string
}) {
  return (
    <div className={cn("bg-primary-foreground px-4 py-8 flex flex-col gap-6 rounded shadow-sm", className)}>
      {children}
    </div>
  )
}

EmptyState.Header = Header
EmptyState.Actions = Actions

export default EmptyState