import { z } from "zod";

export const AddProjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").max(256, "Name must be less than 256 characters"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
})

export type AddProject = z.infer<typeof AddProjectSchema>
