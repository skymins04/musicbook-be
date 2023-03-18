import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import axios from 'axios';
import { Job } from 'bull';
import * as FormData from 'form-data';
import * as fs from 'fs';

export interface CloudflareImagesUploadQueueData {
  path: string;
  uploadId: string;
  uploadURL: string;
}

@Processor('cloudflare-images-upload')
export class CloudflareImagesUploadProccesor {
  constructor() {
    this.logger.log('bull queue processor initialized.');
  }

  private readonly logger = new Logger(CloudflareImagesUploadProccesor.name);

  @Process()
  async uploadFile(job: Job<CloudflareImagesUploadQueueData>) {
    const formData = new FormData();
    if (!fs.existsSync(job.data.path)) {
      this.logger.error(`${job.data.uploadId} not found.`);
      return;
    }

    formData.append('file', fs.createReadStream(job.data.path));
    await axios({
      method: 'POST',
      url: job.data.uploadURL,
      data: formData,
      headers: {
        ...formData.getHeaders(),
      },
    })
      .then(() => {
        this.logger.log(`${job.data.uploadId} cloudflare images uploaded.`);
      })
      .catch(() => {
        this.logger.error(
          `${job.data.uploadId} fail cloudflare images upload.`,
        );
      })
      .finally(() => {
        fs.unlinkSync(job.data.path);
      });
  }
}
