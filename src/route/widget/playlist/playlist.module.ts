import { Module } from '@nestjs/common';
import { JwtAuthService } from 'src/common/jwt-auth/jwt-auth.service';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';

@Module({
  providers: [JwtAuthService, PlaylistService],
  controllers: [PlaylistController],
})
export class PlaylistModule {}
