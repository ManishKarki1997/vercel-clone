import express from 'express'
import ProjectRouter from './features/projects/routes/project.route';

const Router = express.Router()

Router.use("/projects", ProjectRouter)

export default Router;