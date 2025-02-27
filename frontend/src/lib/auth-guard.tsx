import AppDashboardSkeleton from '@/components/skeletons/app-dashboard-skeleton'
import { profileAction } from '@/features/home/actions/auth.action'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Navigate } from 'react-router'

function AuthGuard({ children }: { children: React.ReactNode }) {

  const { data: profileData, error, isFetching: isFetchingUser } = useQuery({
    queryFn: profileAction,
    queryKey: ['profile'],
  })

  if (isFetchingUser) {
    return <AppDashboardSkeleton />
  }

  if (!isFetchingUser && !profileData) {
    return <Navigate to="/login" />
  }

  return children
}

export default AuthGuard