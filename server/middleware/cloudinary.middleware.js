import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
dotenv.config();

cloudinary.config({ 
  cloud_name: 'dvxmaiofh', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET_API
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'PuppyLobby',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

export { storage };




