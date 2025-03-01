import queryString from "query-string"
import { api } from "@/lib/api"
import { AddProject, EditProject, ListProjects, ProjectDetail } from "../schema/project.schema"

export const createProjectAction = (payload: AddProject) => {
  return api.post(`/projects`, payload, { withCredentials: true })
}

export const editProjectAction = (payload: EditProject) => {
  return api.put(`/projects/${payload.id}`, payload, { withCredentials: true })
}

export const listProjectsAction = async (payload: ListProjects) => {
  const params = queryString.stringify(payload)
  const response = await api.get(`/projects?${params}`, { withCredentials: true })
  const projectsResponse = response.data?.data || []
  return projectsResponse
}

export const projectDetailAction = async (payload: ProjectDetail) => {
  const params = queryString.stringify(payload)
  const response = await api.get(`/projects/${payload.slug}?${params}`, { withCredentials: true })
  const projectsResponse = response.data?.data || null
  return projectsResponse
}
