import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CloudflareR2Service {
  constructor() {
    this.R2 = new AWS.S3({
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      signatureVersion: 'v4',
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    });
  }

  private DEFAULT_BUCKET_NAME = 'musicbook';
  private R2: AWS.S3;

  createBucket(_bucketName: string) {
    return this.R2.createBucket({ Bucket: _bucketName }).promise();
  }

  listBuckets() {
    return this.R2.listBuckets().promise();
  }

  putObject(
    _file: Express.Multer.File,
    _bucketName: string = this.DEFAULT_BUCKET_NAME,
  ) {
    return this.R2.putObject({
      Key: uuidv4(),
      Body: _file.buffer,
      Bucket: _bucketName,
      ContentType: _file.mimetype,
    }).promise();
  }

  listObjects(_bucketName: string = this.DEFAULT_BUCKET_NAME) {
    return this.R2.listObjectsV2({ Bucket: _bucketName }).promise();
  }
}
