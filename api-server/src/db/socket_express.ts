import { Server as SocketServer } from "socket.io";
import { Config } from "../config/env";
import type { Express } from "express"
import { createServer, Server } from "node:http";

let server: Server | null;

const handleSocketEvents = () => {
  if (!server) return;
  const io = new SocketServer(server);

  io.on("connection", socket => {
    console.log("New socket connection ", socket.id)

    socket.on("subscribe", (payload: { deploymentId: string }) => {
      socket.join(payload.deploymentId)
      socket.emit("message", `Subscribed to deployment ${payload.deploymentId}`)
      console.log("Subscribed to deployment ", payload.deploymentId)
    })
  })
}

export const initializeSocket = (app: Express) => {
  server = createServer(app);
  handleSocketEvents()


  app.listen(Config.PORT, () => {
    console.log(`[server]: API Server is running on port ${Config.PORT}`);
  });

  return server
}

// export const io = new Server({
//   cors: {
//     origin: Config.FRONTEND_URLS,
//   }
// })

