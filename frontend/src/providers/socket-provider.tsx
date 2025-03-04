import { Config } from "@/config/config";
import React from "react";
import { io, Socket } from 'socket.io-client';


type SocketContextType = {
  socket: Socket | undefined;
  isConnected: boolean;
}

export const SocketContext = React.createContext<SocketContextType>({
  socket: null,
  isConnected: false
})

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {

  const socket = io(Config.SocketUrl, {
    autoConnect: false,
  })

  const [isConnected, setIsConnected] = React.useState<boolean>(false)


  React.useEffect(() => {
    if (!socket) return

    socket.on("connect", () => {
      console.log("socket connected")
      setIsConnected(true)
    })

    socket.on("disconnect", () => {
      console.log("socket disconnected")
      setIsConnected(true)
    })


    return () => {
      socket.off("connect")
      socket.off("disconnect")
    }

  }, [socket])

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected
      }}>
      {children}
    </SocketContext.Provider>
  )
}