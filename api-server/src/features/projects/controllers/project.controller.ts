import type { Request, Response } from "express";
import { generateSlug } from "random-word-slugs";

import ProjectService from "../services/project.service";
import { Config } from "../../../config/env";

const runProject = async (req: Request, res: Response): Promise<any> => {

  try {
    const slug = generateSlug()
    const finalSlug = req.body?.slug ? req.body.slug : slug

    await ProjectService.runProject({ ...req.body, projectId: finalSlug })

    return res.status(200).json({
      status: "Queued",
      url: `http://${finalSlug}.${Config.PROXY_SERVER}`
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

    const projects = await ProjectService.listProjects({ ...req.query, userId })

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

const ProjectController = {
  runProject,
  createProject,
  updateProject,
  listProjects,
  projectDetail
}

export default ProjectController