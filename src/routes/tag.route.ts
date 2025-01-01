import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { TagController } from "../controllers/tagController";

const tagRoute = Router()
const tagController = new TagController(); 
tagRoute.post('/',verifyToken,(req,res)=>{tagController.createTag(req,res)});
tagRoute.get('/',verifyToken,(req,res)=>{tagController.getAllTags(req,res)});
tagRoute.get('/:id',verifyToken,(req,res)=>{tagController.getTagById(req,res)});

export default tagRoute;