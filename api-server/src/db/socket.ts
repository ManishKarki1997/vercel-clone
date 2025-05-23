import { Server as SocketServer } from "socket.io";
import { Config } from "../config/env";
import type { Express } from "express"

let io: SocketServer | null = null;

export const sendDeploymentEvent = ({ channelId, log }: { channelId: string; log: string; }) => {
  if (!io) return;
  // console.log("sending message to channel ", channelId)
  io.to(channelId).emit("log", log)
}

export const sendRefreshDeploymentsTableEvent = ({ channelId }: { channelId: string; }) => {
  if (!io) return;
  io.to(channelId).emit("refresh_deployments_table", { channelId })
}

const handleSocketEvents = () => {
  if (!io) return;


  io.on("connection", socket => {
    // console.log("New socket connection ", socket.id)

    socket.on("join_deployments_list", (projectId: string) => {
      socket.join(projectId)
    })

    socket.on("leave_deployments_list", (projectId: string) => {
      socket.leave(projectId)
    })

    socket.on("subscribe", (deploymentId: string) => {
      // console.log(`Subscribed to ${deploymentId}`)
      socket.join(deploymentId)
      socket.emit("message", `Subscribed to deployment ${deploymentId}`)
    })

    socket.on("unsubscribe", (deploymentId: string) => {
      // console.log(`Unsubscribed from ${deploymentId}`)
      socket.leave(deploymentId)
    })
  })
}

export const initializeSocket = () => {
  io = new SocketServer({
    cors: {
      origin: Config.FRONTEND_URLS,
    }
  })

  io.listen(Config.SOCKET_SERVER_PORT, () => {
    console.log(`[server]: Socket Server is running on port ${Config.SOCKET_SERVER_PORT}`);
  })

  handleSocketEvents()
}


