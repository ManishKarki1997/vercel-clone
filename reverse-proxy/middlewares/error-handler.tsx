import type { NextFunction, Request, Response } from "express";
import { Config } from "../config/config";

const errorFormatter = (error: Error, next: NextFunction) => {


  if (Config.NODE_ENV === "development") {
    console.error(error);
  }
}

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  errorFormatter(error, next);
  res.status(500).send({
    status: 500,
    message: error.message,
    name: error.name,
  });
};