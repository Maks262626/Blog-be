import { Request, Response } from 'express';
import Article, { IArticle } from '../models/Article';
import mongoose, { DeleteResult } from 'mongoose';
import Comment from '../models/Comment';
import User from '../models/User';

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
      const article = await doc.save();
      res.status(200).json(article);
      return article;
    } catch (err) {
      res.status(500).json({ message: "Failed to create article" });
      return;
    }
  }
  async getAllArticles(req: Request, res: Response): Promise<IArticle[] | undefined> {
    try {
      // ?sort=[date|views|likes|comments]

      enum SortType {
        Date = "date",
        Views = "views",
        Likes = "likes",
        Comments = "comments"
      }
      type SortOption = { [key: string]: 1 | -1 };
      const sortTypeQuery = req.query.sort as SortType;
      const sortOrderQuery = req.query.order as string;
      const sortOrder = sortOrderQuery === 'desc' ? -1 : 1;

      const sortFields: { [key in SortType]: string } = {
        [SortType.Date]: 'createdAt',
        [SortType.Views]: 'viewsCount',
        [SortType.Likes]: 'likes',
        [SortType.Comments]: 'commentsCount'
      }
      let sortField: string = sortFields[sortTypeQuery];
      if (!sortField) {
        sortField = sortFields['date'];
      }

      const sortOption: SortOption = { [sortField]: sortOrder };
      const articles = await Article.find().populate(['author', 'tags']).sort(sortOption);
      const formatedArticles = await Promise.all(articles.map(async (article) => {
        const comments = await Comment.aggregate([
          {
            $match: { parentId: { $exists: false }, article: article._id }
          },
          {
            $lookup: {
              from: 'comments',
              localField: '_id',
              foreignField: 'parentId',
              as: 'replyes'
            }
          },
          {
            $sort: { createdAt: -1 }
          }
        ])

        return {
          ...article.toObject(),
          comments
        }
      }))

      res.json(formatedArticles);
      return articles;
    } catch (err) {
      res.status(500).json({ message: "failed to get articles" });
    }
  }
  async getArticlebyId(req: Request, res: Response): Promise<IArticle | undefined | null> {
    const articleId = req.params.id;
    try {
      const article = await Article.findById(articleId).populate(['author', 'tags']);
      if (!article) {
        res.status(404).json({ message: "Article not found" });
        return;
      }
      const comments = await Comment.aggregate([
        {
          $match: { parentId: { $exists: false }, article: new mongoose.Schema.Types.ObjectId(articleId) }
        },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'parentId',
            as: 'replyes'
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ])
      res.json({ ...article.toObject(), comments });
      return article;
    } catch (err) {
      res.status(500).json({ message: "failed to get article" });
    }
  }
  async deleteArticle(req: Request, res: Response): Promise<DeleteResult | undefined> {
    const articleId = req.params.id;
    if (!articleId) {
      res.status(400).json({ message: "articleId is not provided" });
      return;
    }
    try {
      const article = await Article.deleteOne({ _id: articleId });

      await Comment.deleteMany({ article: articleId });

      res.status(200).json({ message: "article deleted succesfully" })
      return article;
    } catch (err) {
      res.status(500).json({ message: "failed to delete article" });
    }
  }
  async toogleLike(req: Request, res: Response) {
    const articleId = req.params.id;
    const uid = req.user.uid;
    if (!articleId) {
      res.status(400).json({ message: "articleId is not provided" });
      return;
    }
    try {
      const user = await User.findOne({ firebaseUID: uid });
      if (!user) {
        res.status(400).json({ message: "user is not found" });
        return;
      }
      const userId = user._id;
      const isLiked = await Comment.exists({
        _id: articleId,
        likedBy: { $in: [userId] }
      });
      const update = isLiked ? { $inc: { likes: -1 }, $pull: { likedBy: userId } } : { $inc: { likes: 1 }, $push: { likedBy: userId } };
      const result = await Article.updateOne({ _id: articleId }, update, { new: true });
      res.json(result);
      return result;
    } catch (err) {
      res.status(500).json({ message: "failed to hit like" });
    }
  }
}

