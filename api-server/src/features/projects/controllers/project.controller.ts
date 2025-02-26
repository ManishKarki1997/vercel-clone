import type { Request, Response } from "express";
import { generateSlug } from "random-word-slugs";

import ProjectService from "../services/project.service";
import { Config } from "../../../config/env";

const runProject = async (req: Request, res: Response) => {

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

const ProjectController = {
  runProject
}

export default ProjectController