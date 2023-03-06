import { Global, Module } from '@nestjs/common';
import { CloudflareImagesService } from './cloudflare-images.service';

@Global()
@Module({
  providers: [CloudflareImagesService],
  exports: [CloudflareImagesService],
})
export class CloudflareModule {}
