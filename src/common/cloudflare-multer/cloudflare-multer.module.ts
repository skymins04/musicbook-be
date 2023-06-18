import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CloudflareModule } from '../cloudflare/cloudflare.module';
import { CloudflareImagesService } from '../cloudflare/cloudflare-images.service';
import { CloudflareR2Service } from '../cloudflare/cloudflare-r2.service';
import { getCloudflareStorage } from './cloudflare-storage.engine';

@Global()
@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [CloudflareModule],
      inject: [CloudflareImagesService, CloudflareR2Service],
      useFactory: (cloudflareR2Service: CloudflareR2Service) => ({
        storage: getCloudflareStorage(cloudflareR2Service),
        limits: {
          fileSize: 50 * 1024 * 1024,
        },
      }),
    }),
  ],
  exports: [MulterModule],
})
export class CloudflareMulterModule {}
