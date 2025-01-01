import { Router } from "express";
import { CommentController } from "../controllers/commentController";
import { verifyToken } from "../middlewares/verifyToken";

const commentRoute = Router()
const commentController = new CommentController();

commentRoute.post('/', verifyToken, (req, res) => { commentController.createComment(req, res) });
commentRoute.get('/:id', verifyToken, (req, res) => { commentController.getComment(req, res) });
commentRoute.put('/:id', verifyToken, (req, res) => { commentController.updateComment(req, res) });
commentRoute.put('/like/:id', verifyToken, (req, res) => { commentController.toggleLike(req, res) });
commentRoute.delete('/:id', verifyToken, (req, res) => { commentController.deleteComment(req, res) });

export default commentRoute;