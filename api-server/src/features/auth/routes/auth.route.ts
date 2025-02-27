import express from 'express'
import AuthController from '../controllers/auth.controller';

const AuthRouter = express.Router();

AuthRouter.post("/signup", AuthController.signup)
AuthRouter.post("/login", AuthController.login)
AuthRouter.get("/profile", AuthController.profile)

export default AuthRouter;
