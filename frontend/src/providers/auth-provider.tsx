import { User } from "@/features/app/types/auth.types";
import { profileAction } from "@/features/home/actions/auth.action"
import { useQuery } from "@tanstack/react-query"
import React from "react"

type AuthContextType = {
  isLoadingProfile: boolean;
  user: User | null;
  wasPreviouslyLoggedIn: boolean;
  showAppSkeleton: boolean;
  canAccessAppDashboard: boolean;
  error: any,
}

export const AuthContext = React.createContext<AuthContextType>({
  isLoadingProfile: false,
  user: null,
  wasPreviouslyLoggedIn: false,
  showAppSkeleton: false,
  canAccessAppDashboard: false,
  error: null
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: profileData, error, isFetching: isFetchingUser } = useQuery({
    queryFn: profileAction,
    queryKey: ['profile'],
  })

  const isLoadingProfile = isFetchingUser
  const user = profileData || null
  const wasPreviouslyLoggedIn = localStorage.getItem("isLoggedIn") === "true"

  const showAppSkeleton = isLoadingProfile && wasPreviouslyLoggedIn && !user
  const canAccessAppDashboard = !!profileData

  return (
    <AuthContext.Provider
      value={{
        isLoadingProfile,
        user,
        wasPreviouslyLoggedIn,
        showAppSkeleton,
        canAccessAppDashboard,
        error
      }}>
      {children}
    </AuthContext.Provider>
  )
}

