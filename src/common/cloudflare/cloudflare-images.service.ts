import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CloudflareImagesService {
  getDirectUploadURL(_options?: {
    meta?: Record<string, string | number>;
    signedURL?: boolean;
  }) {
    const formData = new FormData();
    if (_options?.signedURL)
      formData.append(
        'requireSignedURLs',
        _options.signedURL ? 'true' : 'false',
      );
    if (_options?.meta)
      formData.append('metadata', JSON.stringify(_options.meta));

    return axios({
      method: 'POST',
      url: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGES_TOKEN}`,
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    })
      .then((res) => ({
        id: res.data.result.id as string,
        uploadURL: res.data.result.uploadURL as string,
      }))
      .catch((err) => {
        throw new Error(err);
      });
  }

  getImageInfo(_imgId: string) {
    return axios({
      method: 'GET',
      url: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${_imgId}`,
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGES_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }).then((res) => res.data);
  }
}
