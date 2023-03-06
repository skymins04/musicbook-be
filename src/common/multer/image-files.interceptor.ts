import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as path from 'path';
import { cloudflareImagesStorage } from '../cloudflare/cloudflare-images-storage';

export const ImageFilesInterceptor = (fields: MulterField[]) =>
  FileFieldsInterceptor(fields, {
    fileFilter(req, file, callback) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
    // storage: diskStorage({
    //   destination: './.uploads',
    //   filename: (req, file, callback) => {
    //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    //     callback(
    //       null,
    //       file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname),
    //     );
    //   },
    // }),
    storage: cloudflareImagesStorage(),
  });
