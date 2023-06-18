import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CloudflareR2Service {
  private readonly R2 = new AWS.S3({
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    signatureVersion: 'v4',
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  });
  private readonly DEFAULT_BUCKET_NAME =
    process.env.NODE_ENV === 'production'
      ? 'musicbook-assets'
      : 'musicbook-assets-dev';

  createBucket(_bucketName: string) {
    return this.R2.createBucket({ Bucket: _bucketName }).promise();
  }

  listBuckets() {
    return this.R2.listBuckets().promise();
  }

  putObject(
    _buffer: Buffer,
    _contentType: string,
    _options?: {
      _key?: string;
      _bucketName?: string;
    },
  ) {
    return this.R2.putObject({
      Key: _options?._key || uuidv4(),
      Body: _buffer,
      Bucket: _options?._bucketName || this.DEFAULT_BUCKET_NAME,
      ContentType: _contentType,
    }).promise();
  }

  listObjects(_bucketName: string = this.DEFAULT_BUCKET_NAME) {
    return this.R2.listObjectsV2({ Bucket: _bucketName }).promise();
  }
}
