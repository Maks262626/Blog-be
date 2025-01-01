import { Router } from "express";
import { UserController } from "../controllers/usersController";
import { verifyToken } from "../middlewares/verifyToken";

const usersRouter = Router();
const userController = new UserController();

usersRouter.get('/',verifyToken, (req, res) => {userController.getAllUsers(req,res)});
usersRouter.get('/:id',verifyToken, (req, res) => {userController.getUserById(req,res)});
usersRouter.put('/:id',verifyToken, (req, res) => {userController.updateUser(req,res)});
usersRouter.delete('/:id',verifyToken, (req, res) => {userController.deleteUser(req,res)});

export default usersRouter;