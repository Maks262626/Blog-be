import { Router } from "express";
import { FirebaseAuthController } from "../controllers/firebaseAuthController";

const authRouter = Router();
const firebaseAuthController = new FirebaseAuthController();

authRouter.post('/register', (req,res)=>{firebaseAuthController.registerUser(req,res)})
authRouter.post('/login', (req,res)=>{firebaseAuthController.loginUser(req,res)})
authRouter.post('/logout', (req,res)=>{firebaseAuthController.logout(req,res)})

export default authRouter;