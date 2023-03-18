import { Request } from 'express';
import { StorageEngine, memoryStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';
import { CloudflareImagesService } from '../cloudflare/cloudflare-images.service';
import { CloudflareR2Service } from '../cloudflare/cloudflare-r2.service';

export class CloudflareStorage implements StorageEngine {
  constructor(
    private readonly cloudflareImagesService: CloudflareImagesService,
    private readonly cloudflareR2Service: CloudflareR2Service,
  ) {
    this.memoryStorage = memoryStorage();
  }

  private memoryStorage: StorageEngine;

  _handleFile(
    _req: Request,
    _file: Express.Multer.File,
    _cb: (error?: any, info?: Partial<Express.Multer.File>) => void,
  ) {
    this.memoryStorage._handleFile(_req, _file, (e, _memoryFile) => {
      for (const key of Object.keys(_memoryFile)) {
        _file[key] = _memoryFile[key];
      }
      if (!_file.buffer) throw new BadRequestException('file buffer is empty');

      if (_file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        console.log('Run images service');
        // this.cloudflareR2Service.putObject(_file).then((result) => {
        //   console.log(result);
        //   _cb(null, {});
        // });
      } else {
        console.log('Run R2 service');
        this.cloudflareR2Service.putObject(_file).then((result) => {
          console.log(result);
          _cb(null, {});
        });
      }
    });
  }

  _removeFile(
    _req: Request,
    _file: Express.Multer.File & { name: string },
    _cb: (error: Error | null) => void,
  ) {
    _cb(null);
  }
}

export const getCloudflareStorage = (
  imagesService: CloudflareImagesService,
  r2Service: CloudflareR2Service,
) => new CloudflareStorage(imagesService, r2Service);
