import type { Request, Response } from "express";
import { generateSlug } from "random-word-slugs";

import ProjectService from "../services/project.service";
import { Config } from "../../../config/env";
import type { DeleteDeployment, ListDeploymentLogs, ListProjectDeployments, ListProjectSettings } from "../schema/project.schema";

const deployProject = async (req: Request, res: Response): Promise<any> => {

  const userId = req.user?.sub

  try {
    const slug = generateSlug()
    const finalSlug = req.body?.slug ? req.body.slug : slug

    const data = await ProjectService.deployProject({ ...req.body, projectId: finalSlug, userId })

    return res.status(200).json({
      status: "Queued",
      url: `http://${finalSlug}.${Config.PROXY_SERVER}`,
      data
    })
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      error: error?.message || "Something went wrong"
    })
  }

}

const createProject = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.sub

  try {

    const project = await ProjectService.createProject({ ...req.body, userId })

    return res.status(200).json({
      message: "Project created successfully",
      data: project
    })
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      error: error?.message || "Something went wrong"
    })
  }
}

const updateProject = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.sub

  try {

    const project = await ProjectService.updateProject({ ...req.body, userId })

    return res.status(200).json({
      message: "Project updated successfully",
      data: project
    })
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      error: error?.message || "Something went wrong"
    })
  }
}

const listProjects = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.sub

  try {

    const payload: ListProjectDeployments = {
      limit: req.query.limit ? Number(req.query.limit) : 10,
      page: req.query.page ? Number(req.query.page) : 1,
      projectId: req.query.projectId as string,
      userId: userId as string
    }

    const projects = await ProjectService.listProjects(payload)

    return res.status(200).json({
      message: "Projects listed successfully",
      data: projects
    })
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      error: error?.message || "Something went wrong"
    })
  }
}

const listProjectDeployments = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.sub!

  try {
    const payload: ListProjectDeployments = {
      limit: req.query.limit ? Number(req.query.limit) : 10,
      page: req.query.page ? Number(req.query.page) : 1,
      projectId: req.query.projectId as string,
      userId: userId as string
    }

    const deployments = await ProjectService.listProjectDeployments(payload)

    return res.status(200).json({
      message: "Projectdeployments listed successfully",
      data: deployments
    })
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      error: error?.message || "Something went wrong"
    })
  }
}

const projectDetail = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.sub

  try {
    const project = await ProjectService.projectDetail({ ...req.query, userId })

    return res.status(200).json({
      message: "Projects listed successfully",
      data: project
    })
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      error: error?.message || "Something went wrong"
    })
  }
}

const updateSettings = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.sub

  try {

    const project = await ProjectService.updateSettings({ ...req.body, userId })

    return res.status(200).json({
      message: "Project settings updated successfully",
      data: project
    })
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      error: error?.message || "Something went wrong"
    })
  }
}

const listSettings = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.sub

  try {

    const payload: ListProjectSettings = {
      projectId: req.params.id,
      userId: userId as string
    }

    const settings = await ProjectService.listSettings(payload)

    return res.status(200).json({
      message: "Project settings listed successfully",
      data: settings
    })
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      error: error?.message || "Something went wrong"
    })
  }
}

const listDeploymentLogs = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.sub

  try {

    const payload: ListDeploymentLogs = {
      deploymentId: req.params.id,
      userId: userId as string
    }

    const logs = await ProjectService.listDeploymentLogs(payload)

    return res.status(200).json({
      message: "Deployment logs listed successfully",
      data: logs
    })
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      error: error?.message || "Something went wrong"
    })
  }
}

const deleteDeployment = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.sub

  try {
    const payload: DeleteDeployment = {
      deploymentId: req.params.id,
      userId: userId as string
    }

    await ProjectService.deleteDeployment(payload)

    return res.status(200).json({
      message: "Deployment deleted successfully",
      data: null
    })
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      error: error?.message || "Something went wrong"
    })
  }
}

const getProjectIdBySlug = async (req: Request, res: Response): Promise<any> => {
  const slug = req.params.slug;

  try {
    const projectId = await ProjectService.getProjectIdBySlug(slug)

    return res.status(200).json({
      message: "Project id found",
      data: projectId
    })
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      error: error?.message || "Something went wrong"
    })
  }
}

const ProjectController = {
  deployProject,
  createProject,
  updateProject,
  listProjects,
  projectDetail,
  listProjectDeployments,
  updateSettings,
  listSettings,
  listDeploymentLogs,
  deleteDeployment,
  getProjectIdBySlug
}

export default ProjectController