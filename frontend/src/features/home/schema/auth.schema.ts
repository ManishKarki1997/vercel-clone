
import { z } from "zod"

export const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").max(50, "Name must be less than 50 characters"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long").max(32, "Password must be less than 32 characters"),
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(32),
})


export type Signup = z.infer<typeof SignupSchema>
export type Login = z.infer<typeof LoginSchema>