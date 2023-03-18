import { Global, Module } from '@nestjs/common';
import { CloudflareImagesService } from './cloudflare-images.service';
import { CloudflareR2Service } from './cloudflare-r2.service';

@Global()
@Module({
  providers: [CloudflareImagesService, CloudflareR2Service],
  exports: [CloudflareImagesService, CloudflareR2Service],
})
export class CloudflareModule {}
