import express from 'express'
import ProjectController from '../controllers/project.controller';
import { auth } from '../../../utils/auth';

const ProjectRouter = express.Router();

ProjectRouter.get("/slug-to-id/:slug", ProjectController.getProjectIdBySlug)

// TODO add zod schema validation and error formatting later
ProjectRouter.get("/", auth, ProjectController.listProjects)
ProjectRouter.post("/", auth, ProjectController.createProject)
ProjectRouter.put("/:id", auth, ProjectController.updateProject)
ProjectRouter.put("/:id/settings", auth, ProjectController.updateSettings)
ProjectRouter.get("/:id/settings", auth, ProjectController.listSettings)
ProjectRouter.get("/:slug", auth, ProjectController.projectDetail)
ProjectRouter.get("/:slug/deployments", auth, ProjectController.listProjectDeployments)
ProjectRouter.post("/:slug/deploy", auth, ProjectController.deployProject)

ProjectRouter.get("/deployments/:id/logs", auth, ProjectController.listDeploymentLogs)
ProjectRouter.delete("/deployments/:id", auth, ProjectController.deleteDeployment)

export default ProjectRouter;