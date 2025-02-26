import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import { Config } from "./config/env";
import Router from "./route";

dotenv.config();

const app = express();
const port = Config.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the API server");
});

app.use("/api/v1", Router)

app.listen(port, () => {
  console.log(`[server]: API Server is running on port ${port}`);
});