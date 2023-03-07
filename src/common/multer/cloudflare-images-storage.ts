import { Request } from 'express';
import { StorageEngine } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

export class CloudflareImagesStorage implements StorageEngine {
  private uploadImageByURL(_imageURL: string, _meta?: Record<string, string>) {
    const formData = new FormData();
    formData.append('url', _imageURL);
    if (_meta) formData.append('meta', JSON.stringify(_meta));

    return axios
      .post(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGES_TOKEN}`,
          },
        },
      )
      .then(
        (res) =>
          ({
            id: res.data.result.id,
            filename: res.data.result.filename,
            metadata: res.data.result.metadata,
          } as { id: string; filename: string; metadata: string }),
      )
      .catch((err) => {
        console.log(err);
        throw new Error('failed upload to cloudflare images');
      });
  }

  _handleFile(
    req: Request,
    file: Express.Multer.File,
    cb: (error?: any, info?: Partial<Express.Multer.File>) => void,
  ) {
    try {
      const uploadPath = path.join(__dirname, '..', '..', '..', '.uploads');
      const fileName = `${Date.now() + '-' + Math.round(Math.random() * 1e9)}_${
        file.originalname
      }`;
      const filePath = path.join(uploadPath, fileName);
      if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
      const outStream = fs.createWriteStream(filePath);
      file.stream.pipe(outStream);
      outStream.on('error', cb);
      outStream.on('finish', async () => {
        const res = await this.uploadImageByURL(
          `${process.env.API_ADDRESS}/${process.env.STATIC_SERVE_ROOT}/${fileName}`,
        );
        fs.unlinkSync(filePath);
        cb(null, {
          filename: res.id,
          originalname: res.filename,
        });
      });
    } catch (err) {
      cb(err);
    }
  }

  _removeFile(
    req: Request,
    file: Express.Multer.File & { name: string },
    cb: (error: Error | null) => void,
  ) {
    cb(null);
  }
}

export const cloudflareImagesStorage = () => new CloudflareImagesStorage();
