import express from 'express'
import { auth } from '../../../utils/auth';
import AppController from '../controllers/app.controller';

const AppRouter = express.Router();

AppRouter.get("/dashboard", auth, AppController.dashboard)

export default AppRouter;

