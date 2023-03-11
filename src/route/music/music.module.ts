import { Global, Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { JwtAuthService } from 'src/common/jwt-auth/jwt-auth.service';
import { MusicBookRepository } from 'src/common/repository/musicbook/musicbook.repository';
import { MelonService } from '../melon/melon.service';

@Global()
@Module({
  controllers: [MusicController],
  providers: [MusicService, JwtAuthService, MusicBookRepository, MelonService],
})
export class MusicModule {}
