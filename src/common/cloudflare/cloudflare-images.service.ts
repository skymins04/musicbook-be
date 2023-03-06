import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CloudflareImagesService {
  uploadImageByURL(_imageURL: string, _meta?: Record<string, string>) {
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
}
