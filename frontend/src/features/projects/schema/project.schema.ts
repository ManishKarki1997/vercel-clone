import { z } from "zod";

export const AddProjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").max(256, "Name must be less than 256 characters"),
  gitUrl: z.string().url("Git repo url must be present"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
})

export type AddProject = z.infer<typeof AddProjectSchema>

export const EditProjectSchema = AddProjectSchema.extend({
  id: z.string(),
  slug: z.string()
})
export type EditProject = z.infer<typeof EditProjectSchema>


export const DeployProjectSchema = z.object({
  slug: z.string()
})
export type DeployProject = z.infer<typeof DeployProjectSchema>

export const ListProjectsSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(1)
})

export type ListProjects = z.infer<typeof ListProjectsSchema>

export const ProjectDetailSchema = z.object({
  slug: z.string(),
})

export type ProjectDetail = z.infer<typeof ProjectDetailSchema>

export const ListProjectDeploymentsSchema = z.object({
  projectId: z.string(),
  page: z.number().default(1),
  limit: z.number().default(1)
})

export type ListProjectDeployments = z.infer<typeof ListProjectDeploymentsSchema>



export const SettingsSchema = z.object({
  userId: z.string(),
  projectId: z.string(),
  environmentVariables: z.array(z.object({
    userId: z.string(),
    projectId: z.string(),
    name: z.string().min(2, {
      message: "Environment variable name must be at least 2 characters.",
    }),
    value: z.string().min(2, {
      message: "Environment variable value must be at least 2 characters.",
    }),
  })),
})

export type ProjectSetting = z.infer<typeof SettingsSchema>