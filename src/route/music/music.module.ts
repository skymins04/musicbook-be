import { Global, Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { JwtAuthService } from 'src/common/jwt-auth/jwt-auth.service';
import { MusicBookRepository } from 'src/common/repository/musicbook/musicbook.repository';
import { MelonService } from '../melon/melon.service';
import { MusicBookLikeRepository } from 'src/common/repository/musicbook/musicbook-like.repository';
import { MusicBookSourceRepository } from 'src/common/repository/musicbook/musicbook-source.repository';
import { CloudflareImagesService } from 'src/common/cloudflare/cloudflare-images.service';

@Global()
@Module({
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
