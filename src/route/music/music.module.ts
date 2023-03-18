import { Global, Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { JwtAuthService } from 'src/common/jwt-auth/jwt-auth.service';

@Global()
@Module({
  controllers: [MusicController],
  providers: [MusicService, JwtAuthService],
})
export class MusicModule {}
