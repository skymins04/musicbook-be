import { Request } from 'express';
import { StorageEngine, diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';
import { CloudflareImagesService } from '../cloudflare/cloudflare-images.service';
import { CloudflareR2Service } from '../cloudflare/cloudflare-r2.service';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import * as fs from 'fs';

export class CloudflareStorage implements StorageEngine {
  constructor(private readonly cloudflareR2Service: CloudflareR2Service) {
    this.diskStorage = diskStorage({
      destination: join(__dirname, '..', '..', '..', '.uploads'),
    });
  }

  private diskStorage: StorageEngine;

  _handleFile(
    _req: Request,
    _file: Express.Multer.File,
    _cb: (error?: any, info?: Partial<Express.Multer.File>) => void,
  ) {
    // TODO: Disk I/O 없이 파일을 올릴 순 없을까?
    this.diskStorage._handleFile(_req, _file, (e, _diskFile) => {
      for (const key of Object.keys(_diskFile)) {
        _file[key] = _diskFile[key];
      }
      if (!_file.path) throw new BadRequestException('file path is empty');
      const key = uuidv4();
      this.cloudflareR2Service
        .putObject(fs.readFileSync(_file.path), _file.mimetype, { _key: key })
        .then((result) => {
          fs.unlinkSync(_file.path);
          _cb(null, { filename: key });
        });
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

export const getCloudflareStorage = (r2Service: CloudflareR2Service) =>
  new CloudflareStorage(r2Service);
