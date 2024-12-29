import { Request, Response } from 'express';
import { v2 as cloudinary } from "cloudinary";
import Datauri from "datauri/parser.js";
import path from 'path';
import { CLOUDINARY_FOLDER } from '../constants';

export class FileController {
  async upload(req: Request, res: Response) {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({ message: "No files provided" });
      return;
    }

    const dUri = new Datauri();
    const uploadResults: { url: string }[] = [];

    try {
      for (const file of req.files) {
        const formattedFile = dUri.format(
          path.extname(file.originalname).toString(),
          file.buffer
        ).content;

        if (!formattedFile) {
          res.status(400).json({ message: "File format issue" });
          return;
        }

        const result = await cloudinary.uploader.upload(formattedFile, {
          folder: CLOUDINARY_FOLDER,
        });
        uploadResults.push({ url: result.url });
      }

      res.status(200).json({
        message: "Your images have been uploaded successfully to Cloudinary",
        data: uploadResults,
      });
    } catch (err) {
      res.status(400).json({
        message: "Something went wrong while processing your request",
        data: { err },
      });
    }
  }
}