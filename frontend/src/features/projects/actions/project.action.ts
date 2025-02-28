import { api } from "@/lib/api"
import { AddProject } from "../schema/project.schema"

export const createProjectAction = (payload: AddProject) => {
  return api.post(`/projects`, payload, { withCredentials: true })
}
