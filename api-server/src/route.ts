import express from 'express'
import ProjectRouter from './features/projects/routes/project.route';
import AuthRouter from './features/auth/routes/auth.route';

const Router = express.Router()

Router.use("/auth", AuthRouter)
Router.use("/projects", ProjectRouter)

export default Router;