import { Router } from "express";
import { ArticleController } from "../controllers/articleController";

const articleRouter = Router();
const articleController = new ArticleController();

articleRouter.post('/', (req, res) => { articleController.createArticle(req, res) });
articleRouter.get('/', (req, res) => { articleController.getAllArticles(req, res) });
articleRouter.get('/:id', (req, res) => { articleController.getArticlebyId(req, res) });
articleRouter.delete('/:id', (req, res) => { articleController.deleteArticle(req, res) });

export default articleRouter;