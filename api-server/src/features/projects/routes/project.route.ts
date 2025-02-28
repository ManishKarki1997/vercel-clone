import express from 'express'
import ProjectController from '../controllers/project.controller';
import { auth } from '../../../utils/auth';

const ProjectRouter = express.Router();


ProjectRouter.get("/", auth, ProjectController.listProjects)
ProjectRouter.post("/", auth, ProjectController.createProject)
ProjectRouter.post("/run", ProjectController.runProject)

export default ProjectRouter;