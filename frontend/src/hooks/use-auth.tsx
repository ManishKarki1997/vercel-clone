import { AuthContext } from "@/providers/auth-provider"
import React from "react"

export const useAuth = () => {
  const ctx = React.useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within a AuthProvider")
  }

  return ctx
}