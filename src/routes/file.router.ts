import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { FileController } from "../controllers/fileController";
import { MAX_IMAGES_TRANSFER } from "../constants";
import { upload } from "../config/multer";

const fileRouter = Router();
const fileController = new FileController();

fileRouter.post('/', verifyToken, upload.array("images", MAX_IMAGES_TRANSFER), (req, res) => { fileController.upload(req, res) });

export default fileRouter;