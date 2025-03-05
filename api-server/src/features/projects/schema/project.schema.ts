import { z } from "zod";

export const AddProjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").max(256, "Name must be less than 256 characters"),
  gitUrl: z.string().url("Git repo url must be present"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  userId: z.string().nullable()
})

export type AddProject = z.infer<typeof AddProjectSchema>

export const EditProjectSchema = AddProjectSchema.extend({
  id: z.string(),
  slug: z.string()
})
export type EditProject = z.infer<typeof EditProjectSchema>


export const DeployProjectSchema = z.object({
  slug: z.string(),
  userId: z.string()
})
export type DeployProject = z.infer<typeof DeployProjectSchema>


export const ListProjectsSchema = z.object({
  userId: z.string(),
  page: z.number().default(1),
  limit: z.number().default(1)
})

export type ListProjects = z.infer<typeof ListProjectsSchema>

export const ListProjectDeploymentsSchema = z.object({
  projectId: z.string(),
  userId: z.string(),
  page: z.number().default(1),
  limit: z.number().default(1)
})

export type ListProjectDeployments = z.infer<typeof ListProjectDeploymentsSchema>



export const ProjectDetailSchema = z.object({
  slug: z.string(),
  id: z.string().optional()
})

export type ProjectDetail = z.infer<typeof ProjectDetailSchema>


export const PatchDeploymentSchema = z.object({
  userId: z.string(),
  id: z.string(),
  status: z.enum(["Started", "Running", "Completed", "Failed"]),
  deploymentUrl: z.string().optional(),
  commitHash: z.string().optional(),
  commitMessage: z.string().optional(),
  completedAt: z.date().optional()
})
export type PatchDeployment = z.infer<typeof PatchDeploymentSchema>



export const PatchProjectSchema = z.object({
  userId: z.string(),
  id: z.string().optional(),
  status: z.enum(["Active", "Archived"]).optional(),
  deploymentUrl: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters long").max(256, "Name must be less than 256 characters").optional(),
  gitUrl: z.string().url("Git repo url must be present").optional(),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  slug: z.string()
})
export type PatchProject = z.infer<typeof PatchProjectSchema>



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


export const ListProjectSettingsSchema = z.object({
  userId: z.string(),
  projectId: z.string(),
})

export type ListProjectSettings = z.infer<typeof ListProjectSettingsSchema>
