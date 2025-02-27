import AppDashboardSkeleton from '@/components/skeletons/app-dashboard-skeleton'
import { profileAction } from '@/features/home/actions/auth.action'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

function AuthGuard({ children }: { children: React.ReactNode }) {

  const { data: profileData, error, isFetching: isFetchingUser } = useQuery({
    queryFn: profileAction,
    queryKey: ['profile'],
  })

  if (true) {
    return <AppDashboardSkeleton />
  }

  return (
    <div>AuthGuard</div>
  )
}

export default AuthGuard