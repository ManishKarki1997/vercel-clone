import queryString from "query-string"
import { api } from "@/lib/api"
import { AddProject, ListProjects } from "../schema/project.schema"

export const createProjectAction = (payload: AddProject) => {
  return api.post(`/projects`, payload, { withCredentials: true })
}

export const listProjectsAction = async (payload: ListProjects) => {
  const params = queryString.stringify(payload)
  const response = await api.get(`/projects?${params}`, { withCredentials: true })
  const projectsResponse = response.data?.data || []
  return projectsResponse
}
