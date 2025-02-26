import express from 'express'
import ProjectController from '../controllers/project.controller';

const ProjectRouter = express.Router();


ProjectRouter.post("/", ProjectController.runProject)

export default ProjectRouter;