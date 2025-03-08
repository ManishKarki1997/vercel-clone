import "express-async-errors";
import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'

import { Config } from "./config/env";
import Router from "./route";
import { errorHandler } from "./utils/error-handler";
import type { SupabaseJWTUser } from "./types/supabase.type";
import { initSubscribeToLogs } from "./db/redis";
// import { initializeSocket } from "./db/socket_express";
import { initializeSocket } from "./db/socket";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = Config.PORT



app.use(cors({
  origin: Config.FRONTEND_URLS,
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the API server");
});

app.use("/api/v1", Router)

if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const distFolder = path.join(__dirname, "../../frontend", 'dist');

  // Serve the static files from the 'dist' folder
  app.use(express.static(distFolder));

  // Handle all other routes by sending the index.html file (important for SPAs)
  app.get('*', (req, res) => {
    res.sendFile(path.join(distFolder, 'index.html'));
  });
}

app.use(errorHandler)

initSubscribeToLogs()

// initializeSocket(app)
initializeSocket()

app.listen(port, () => {
  console.log(`[server]: API Server is running on port ${port}`);
});