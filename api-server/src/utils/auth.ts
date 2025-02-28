import type { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { Config } from "../config/env";
import { AuthenticationError } from "./error";
import type { SupabaseJWTUser } from "../types/supabase.type";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.cookies
  if (cookies[Config.COOKIE_NAME] === undefined) {
    throw new AuthenticationError("Session expired. Please login again")
  }

  const decodedUser = await jwt.verify(cookies[Config.COOKIE_NAME], Config.SUPABASE_JWT_SECRET)
  req.user = decodedUser
  next()

}