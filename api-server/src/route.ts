import express from 'express'
import ProjectRouter from './features/projects/routes/project.route';
import AuthRouter from './features/auth/routes/auth.route';
import AppRouter from './features/app/routes/app.routes';

const Router = express.Router()

Router.use("/auth", AuthRouter)
Router.use("/projects", ProjectRouter)
Router.use("/app", AppRouter)

export default Router;