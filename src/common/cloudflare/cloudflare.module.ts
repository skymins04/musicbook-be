import { Global, Module } from '@nestjs/common';
import { CloudflareImagesService } from './cloudflare-images.service';
import { CloudflareR2Service } from './cloudflare-r2.service';
import { BullModule } from '@nestjs/bull';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'cloudflare-images-upload',
    }),
  ],
  providers: [CloudflareImagesService, CloudflareR2Service],
  exports: [CloudflareImagesService, CloudflareR2Service],
})
export class CloudflareModule {}
