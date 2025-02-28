import React from 'react'
import AppHeader from './app-header'
import { Outlet } from 'react-router'

function AppWrapper() {
  return (
    <div className='bg-muted'>
      <AppHeader />

      <main className='min-h-[calc(100vh-70px)]'>
        <Outlet />
      </main>

    </div>
  )
}

export default AppWrapper