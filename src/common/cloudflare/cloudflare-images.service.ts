import { BadRequestException, Injectable } from '@nestjs/common';
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

  getDirectUploadURLWithMetadata(
    _type: string,
    _uploader: string,
    _ip: string,
  ) {
    return this.getDirectUploadURL({
      meta: {
        type: _type,
        uploader: _uploader,
        ip: _ip,
        timestamp: new Date().toISOString(),
      },
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

  async validateImage(_imgId: string, _uploader: string, _type: string) {
    const { result } = await this.getImageInfo(_imgId);
    if (result.draft) throw new BadRequestException('not uploaded yet');
    if (
      !result.meta.type ||
      result.meta.type !== _type ||
      result.meta.uploader !== _uploader
    )
      throw new BadRequestException('invaild image');
  }
}
