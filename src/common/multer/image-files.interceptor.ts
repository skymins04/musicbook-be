import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { cloudflareImagesStorage } from './cloudflare-images-storage';

export const ImageFilesInterceptor = (fields: MulterField[]) =>
  FileFieldsInterceptor(fields, {
    fileFilter(req, file, callback) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
    storage: cloudflareImagesStorage(),
  });
