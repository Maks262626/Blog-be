import { Request, Response } from 'express';
import Article, { IArticle } from '../models/Article';
import { DeleteResult } from 'mongoose';

export class ArticleController {
  async createArticle(req: Request, res: Response): Promise<IArticle | undefined> {
    const { title, text, tags, author, imageUrls } = req.body;
    if (!title || !text || !author) {
      res.status(400).json({ message: "not all required fields provided" });
      return;
    }
    const articleData: Partial<IArticle> = {
      title,
      text,
      tags,
      author,
      imageUrls
    }
    try {
      const doc = new Article({ ...articleData });
      const article = doc.save();
      res.status(200).json(article);
      return article;
    } catch (err) {
      res.status(500).json({ message: "Failed to create article" });
      return;
    }
  }
  async getAllArticles(req: Request, res: Response): Promise<IArticle[] | undefined> {
    try {
      const articles = await Article.find();
      res.json(articles);
      return articles;
    } catch (err) {
      res.status(500).json({ message: "failed to get articles" });
    }
  }
  async getArticlebyId(req: Request, res: Response): Promise<IArticle | undefined | null> {
    const articleId = req.params.id;
    try {
      const article = await Article.findById(articleId);
      res.json(article);
      return article;
    } catch (err) {
      res.status(500).json({ message: "failed to get article" });
    }
  }
  async deleteArticle(req: Request, res: Response): Promise<DeleteResult | undefined> {
    const articleId = req.params.id;
    if(!articleId){
      res.status(400).json({ message: "articleId is not provided" });
      return;
    }
    try {
      const article = await Article.deleteOne({_id:articleId});
      res.status(200).json({ message: "article deleted succesfully"})
      return article;
    } catch (err) {
      res.status(500).json({ message: "failed to delete article" });
    }
  }
}

