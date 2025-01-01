import { Request, Response } from 'express';
import Tag from '../models/Tag';

export class TagController {
  async createTag(req: Request, res: Response){
    const {name} = req.body;
    if(!name){
      res.status(400).json({ message: "not all required fields provided" });
      return;
    }
    try{
      const doc = new Tag({name});
      const tag = doc.save();
      res.status(200).json(tag);
      return tag;
    }catch(err){
      res.status(500).json({ message: "Failed to create tag" });
      return;
    }
  }
  async getAllTags(req: Request, res: Response){
    try {
      const tags = await Tag.find();
      res.status(200).json(tags);
      return tags;
    } catch (err) {
      res.status(500).json({ message: "failed to get tags" });
    }
  }
  async getTagById(req: Request, res: Response){
    const tagId = req.params.id;
    try {
      const tag = await Tag.findById(tagId);
      res.status(200).json(tag);
      return tag;
    } catch (err) {
      res.status(500).json({ message: "failed to get tags" });
    }
  }
}