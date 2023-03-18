import { Global, Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { JwtAuthService } from 'src/common/jwt-auth/jwt-auth.service';
import { MusicBookRepository } from 'src/common/repository/musicbook/musicbook.repository';
import { MelonService } from '../melon/melon.service';
import { MusicBookLikeRepository } from 'src/common/repository/musicbook/musicbook-like.repository';
import { MusicBookSourceRepository } from 'src/common/repository/musicbook/musicbook-source.repository';
import { CloudflareImagesService } from 'src/common/cloudflare/cloudflare-images.service';
import { MulterModule } from '@nestjs/platform-express';
import { CloudflareModule } from 'src/common/cloudflare/cloudflare.module';
import { CloudflareR2Service } from 'src/common/cloudflare/cloudflare-r2.service';
import { getCloudflareStorage } from 'src/common/multer/cloudflare-storage.engine';

@Global()
@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [CloudflareModule],
      inject: [CloudflareImagesService, CloudflareR2Service],
      useFactory: (
        cloudflareImagesService: CloudflareImagesService,
        cloudflareR2Service: CloudflareR2Service,
      ) => ({
        storage: getCloudflareStorage(
          cloudflareImagesService,
          cloudflareR2Service,
        ),
        limits: {
          fileSize: 50 * 1024 * 1024,
        },
      }),
    }),
  ],
  controllers: [MusicController],
  providers: [
    MusicService,
    JwtAuthService,
    MusicBookRepository,
    MusicBookLikeRepository,
    MusicBookSourceRepository,
    MelonService,
    CloudflareImagesService,
  ],
})
export class MusicModule {}
