import type { AuthTokenResponsePassword } from "@supabase/supabase-js"
import { db } from "../../../config/db"
import { AuthenticationError, UserInputError } from "../../../utils/error"
import type { Login, Signup } from "../types/auth.type"


const signup = async (payload: Signup) => {
  const newUser = await db.auth.signUp(payload)
  return newUser
}

const login = async (payload: Login): Promise<AuthTokenResponsePassword> => {
  const response = await db.auth.signInWithPassword(payload)

  const { data: user, error } = response

  if (error && error?.code === "email_not_confirmed") {
    throw new UserInputError("Please confirm your email")
  }

  return response
}

const profile = async (accessToken: string) => {
  const { data: user, error } = await db.auth.getUser(accessToken)

  if (error &&
    (error.code === "bad_jwt" || error.code === "session_expired" || error.code === 'session_not_found')) {
    throw new AuthenticationError("Session expired. Please login again")
  }

  return user
}


const AuthService = {
  signup,
  login,
  profile
}

export default AuthService