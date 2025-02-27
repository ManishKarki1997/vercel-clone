import AppDashboardSkeleton from '@/components/skeletons/app-dashboard-skeleton'
import { profileAction } from '@/features/home/actions/auth.action'
import { useAuth } from '@/hooks/use-auth'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Navigate } from 'react-router'

function AuthGuard({ children }: { children: React.ReactNode }) {

  const {
    showAppSkeleton,
    canAccessAppDashboard
  } = useAuth()

  if (showAppSkeleton) {
    return <AppDashboardSkeleton />
  }
  console.log("guard ", { showAppSkeleton, canAccessAppDashboard })

  if (!showAppSkeleton && !canAccessAppDashboard) {
    return <Navigate to="/login" />
  }

  return children
}

export default AuthGuard