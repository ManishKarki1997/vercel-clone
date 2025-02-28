import express from 'express'
import AuthController from '../controllers/auth.controller';
import { auth } from '../../../utils/auth';

const AuthRouter = express.Router();

AuthRouter.post("/signup", AuthController.signup)
AuthRouter.post("/login", AuthController.login)
AuthRouter.get("/profile", auth, AuthController.profile)
AuthRouter.post("/logout", AuthController.logout)

export default AuthRouter;
