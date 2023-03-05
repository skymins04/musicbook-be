import { Global, Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';

@Global()
@Module({
  controllers: [MusicController],
  providers: [MusicService],
})
export class MusicModule {}
