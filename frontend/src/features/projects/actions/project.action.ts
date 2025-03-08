import queryString from "query-string"
import { api } from "@/lib/api"
import { AddProject, DeleteDeployment, DeployProject, EditProject, ListDeploymentLogs, ListProjectDeployments, ListProjects, ListProjectSettings, ProjectDetail, ProjectSetting } from "../schema/project.schema"

export const createProjectAction = (payload: AddProject) => {
  return api.post(`/projects`, payload, { withCredentials: true })
}

export const editProjectAction = (payload: EditProject) => {
  return api.put(`/projects/${payload.id}`, payload, { withCredentials: true })
}

export const deployProjectAction = (payload: DeployProject) => {
  return api.post(`/projects/${payload.slug}/deploy`, payload, { withCredentials: true })
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


export const listProjectDeploymentsAction = async (payload: ListProjectDeployments) => {
  const params = queryString.stringify(payload)
  const response = await api.get(`/projects/${payload.projectId}/deployments?${params}`, { withCredentials: true })
  const deploymentsResponse = response.data?.data || []
  return deploymentsResponse
}


export const updateProjectSettingsAction = (payload: ProjectSetting) => {
  return api.put(`/projects/${payload.projectId}/settings`, payload, { withCredentials: true })
}


export const listProjectSettingsAction = async (payload: ListProjectSettings) => {
  const params = queryString.stringify(payload)
  const response = await api.get(`/projects/${payload.projectId}/settings?${params}`, { withCredentials: true })
  const settingsResponse = response.data?.data || []
  return settingsResponse
}

export const listDeploymentLogsAction = async (payload: ListDeploymentLogs) => {
  const params = queryString.stringify(payload)
  const response = await api.get(`/projects/deployments/${payload.deploymentId}/logs?${params}`, { withCredentials: true })
  const logsResponse = response.data?.data || []
  return logsResponse
}


export const deleteDeploymentAction = (payload: DeleteDeployment) => {
  const params = queryString.stringify(payload)
  return api.delete(`/projects/deployments/${payload.deploymentId}?${params}`, { withCredentials: true })
}
