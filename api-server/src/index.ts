import "express-async-errors";
import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { Config } from "./config/env";
import Router from "./route";
import { errorHandler } from "./utils/error-handler";

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

app.use(errorHandler)

app.listen(port, () => {
  console.log(`[server]: API Server is running on port ${port}`);
});