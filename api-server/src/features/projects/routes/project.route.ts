import express from 'express'
import ProjectController from '../controllers/project.controller';
import { auth } from '../../../utils/auth';

const ProjectRouter = express.Router();


// TODO add zod schema validation and error formatting later
ProjectRouter.get("/", auth, ProjectController.listProjects)
ProjectRouter.post("/", auth, ProjectController.createProject)
ProjectRouter.put("/:id", auth, ProjectController.updateProject)
ProjectRouter.get("/:slug", auth, ProjectController.projectDetail)
ProjectRouter.post("/:slug/deploy", auth, ProjectController.deployProject)

export default ProjectRouter;