import type { Request, Response } from "express";

import AuthService from "../services/auth.service";
import { Config } from "../../../config/env";
import { AuthenticationError } from "../../../utils/error";

const signup = async (req: Request, res: Response): Promise<any> => {
  const payload = req.body;

  const newUser = await AuthService.signup(payload)


  return res.status(200).json({
    message: "Signed up successfully",
    success: true,
    data: newUser
  })
}


const login = async (req: Request, res: Response): Promise<any> => {
  const payload = req.body;

  const { data: user } = await AuthService.login(payload)

  if (user.session?.access_token) {

    res.cookie(Config.COOKIE_NAME, user.session?.access_token, {
      httpOnly: true,
      secure: true,
      maxAge: Number(Config.SUPABASE_ACCESS_TOKEN_EXPIRY_SECONDS) * 60 * 60 * 1000,
      sameSite: 'none',
      // domain:"localhost",
      path: "/"
    })
  }

  return res.status(200).json({
    message: "Logged in successfully",
    success: true,
    data: user
  })
}

const profile = async (req: Request, res: Response): Promise<any> => {

  const cookies = req.cookies
  if (cookies[Config.COOKIE_NAME] === undefined) {
    throw new AuthenticationError("Session expired. Please login again")
  }


  const user = await AuthService.profile(req.cookies[Config.COOKIE_NAME])

  return res.status(200).json({
    message: "Profile fetched successfully",
    success: true,
    data: user
  })
}


const AuthController = {
  signup,
  login,
  profile
}

export default AuthController