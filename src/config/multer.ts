import multer from 'multer';
import { MAX_IMAGE_SIZE } from '../constants';

const storage = multer.memoryStorage();
export const upload = multer({ 
  storage,
  limits: {fileSize: MAX_IMAGE_SIZE},
  fileFilter: (_, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    if(mimeType){
      cb(null,true);
    }else{
      cb(new Error("Only image files (jpeg, jpg, png, gif) are allowed"));
    }
  }
 });