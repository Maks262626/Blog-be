import { Request, Response } from 'express';
import Comment, { IComment } from '../models/Comment';
import Article from '../models/Article';
import User from '../models/User';
import mongoose from 'mongoose';

export class CommentController {
  async createComment(req: Request, res: Response): Promise<IComment | undefined> {
    const { text, author, article, parentId } = req.body;
    if (!text || !author || !article) {
      res.status(400).json({ message: "not all required fields provided" });
      return;
    }
    const commentData: Partial<IComment> = {
      text,
      author,
      article,
      parentId
    }
    try {
      const doc = new Comment({ ...commentData });
      const comment = await doc.save();

      const updatedArticle = await Article.findByIdAndUpdate(article,
        {
          $push: { comments: comment._id },
          $inc: { commentsCount: 1 }
        },
        { new: true }
      )
      if (!updatedArticle) {
        res.status(404).json({ message: "Article not found" });
        return;
      }
      res.json(comment);
      return comment;
    } catch (err) {
      res.status(500).json({ message: "Failed to create comment" });
      return;
    }
  }
  async getComment(req: Request, res: Response): Promise<IComment | undefined | null> {
    const commentId = req.params.id;
    try {
      const comment = await Comment.findById(commentId);
      res.json(comment);
      return comment;
    } catch (err) {
      res.status(500).json({ message: "failed to get comement" });
    }
  }
  async updateComment(req: Request, res: Response): Promise<IComment | undefined | null> {
    const commentId = req.params.id;
    const { text } = req.body;
    if (!commentId) {
      res.status(400).json({ message: "commentId is not provided" });
      return;
    }
    if (!text) {
      res.status(400).json({ message: "text is not provided" });
      return;
    }
    try {
      const comment = await Comment.findByIdAndUpdate(commentId, { text }, { new: true });
      res.status(200).json(comment);
      return comment;
    } catch (err) {
      res.status(500).json({ message: "failed to update comment" });
    }
  }
  async deleteComment(req: Request, res: Response): Promise<IComment | undefined | null> {
    const commentId = req.params.id;
    if (!commentId) {
      res.status(400).json({ message: "commentId is not provided" });
      return;
    }
    try {
      const comment = await Comment.findByIdAndDelete(commentId);
      if (!comment) {
        res.status(404).json({ message: "Comment not found" });
        return;
      }
      const delResult = await Comment.deleteMany({ parentId: commentId });
      await Article.findByIdAndUpdate(comment._id, {
        $inc: { commentsCount: -delResult.deletedCount }
      });
      res.status(200).json({ message: "comment deleted succesfully" })
      return comment;
    } catch (err) {
      res.status(500).json({ message: "failed to delete comment" });
    }
  }
  async toggleLike(req: Request, res: Response) {
    const commentId = req.params.id;
    const uid = req.user.uid;
    if (!commentId) {
      res.status(400).json({ message: "commentId is not provided" });
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
        _id: commentId,
        likedBy: { $in: [userId] }
      });
      const update = isLiked ? { $inc: { likes: -1 }, $pull: { likedBy: userId } } : { $inc: { likes: 1 }, $push: { likedBy: userId } };
      const result = await Comment.updateOne({ _id: commentId }, update, { new: true });
      res.json(result);
      return result;
    } catch (err) {
      res.status(500).json({ message: "failed to hit like" });
    }
  }
}