import { SocketContext } from "@/providers/socket-provider"
import React from "react"

export const useSocket = () => {
  const ctx = React.useContext(SocketContext)

  if (!ctx) throw new Error("useSocket must be used within SocketProvider")

  return ctx
}