import { cn } from '@/lib/utils'
import React from 'react'
import AppContainer from './app-container'

function Header({
  children,
  className
}: {
  children: React.ReactNode | React.ReactNode[],
  className?: string

}) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  )
}

function Actions({
  children,
  className
}: {
  children: React.ReactNode | React.ReactNode[],
  className?: string

}) {
  return (
    <div className={cn("", className)}>

      {children}
    </div>
  )
}

function AppPageHeader({
  children,
  className
}: {
  children: React.ReactNode | React.ReactNode[],
  className?: string
}) {
  return (
    <div className={cn("  bg-primary-foreground px-4 py-4", className)}>
      <AppContainer className='flex items-center justify-between flex-wrap gap-4'>
        {children}
      </AppContainer>
    </div>
  )
}

AppPageHeader.Header = Header
AppPageHeader.Actions = Actions

export default AppPageHeader