import type { NextFunction, Request, Response } from "express";
import { Config } from "../config/env";
import { ForbiddenError, HTTPError, InternalServerError, logError, UserInputError } from "./error";

const errorFormatter = (error: Error, next: NextFunction) => {

  if (error instanceof InternalServerError) {
    logError(error.name, error.extra);
  }
  if (error instanceof ForbiddenError) {
    if (error.extra) logError(error.name, error.extra);
    next(error)
  }
  if (error instanceof UserInputError) {
    if (error.extra) logError(error.name, error.extra);
    next(error);
  }
  if (error instanceof HTTPError) {
    if (error.extra) logError(error.name, error.extra);
    next(error);
  } else {
    next(new InternalServerError(error.message));
  }

  if (Config.NODE_ENV === "development") {
    console.error(error);
  }
}

export const errorHandler = (error: HTTPError, req: Request, res: Response, next: NextFunction) => {
  errorFormatter(error, next);
  res.status(error.status).send({
    status: error.status,
    message: error.message,
    name: error.name,
  });
};