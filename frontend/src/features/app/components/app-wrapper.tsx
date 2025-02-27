import React from 'react'
import AppHeader from './app-header'
import { Outlet } from 'react-router'

function AppWrapper() {
  return (
    <div>
      <AppHeader />

      <main className='px-4 py-4  bg-secondary-foreground min-h-[calc(100vh-70px)]'>
        <Outlet />
      </main>
    </div>
  )
}

export default AppWrapper