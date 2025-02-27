import { api } from "@/lib/api"
import { Login, Signup } from "../schema/auth.schema"
import { AxiosError } from "axios"
import { toast } from "sonner"
import { useNavigate } from "react-router"

export const signupAction = (payload: Signup) => {
  return api.post(`/auth/signup`, payload)
}

export const loginAction = (payload: Login) => {
  return api.post(`/auth/login`, payload, {
    withCredentials: true
  })
}

export const profileAction = async () => {

  try {
    const response = await api.get(`/auth/profile`, {
      withCredentials: true
    })

    return response.data?.data?.user
  } catch (error: any) {

    throw error
  }
}