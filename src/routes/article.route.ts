import { Router } from "express";
import { ArticleController } from "../controllers/articleController";
import { verifyToken } from "../middlewares/verifyToken";

const articleRouter = Router();
const articleController = new ArticleController();

articleRouter.post('/', verifyToken, (req, res) => { articleController.createArticle(req, res) });
articleRouter.get('/', verifyToken, (req, res) => { articleController.getAllArticles(req, res) });
articleRouter.get('/:id', verifyToken, (req, res) => { articleController.getArticlebyId(req, res) });
articleRouter.put('/like/:id', verifyToken, (req, res) => { articleController.toogleLike(req, res) });
articleRouter.delete('/:id', verifyToken, (req, res) => { articleController.deleteArticle(req, res) });

export default articleRouter;