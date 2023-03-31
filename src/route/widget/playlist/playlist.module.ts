import { Global, Module } from '@nestjs/common';
import { JwtAuthService } from 'src/common/jwt-auth/jwt-auth.service';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';

@Global()
@Module({
  providers: [JwtAuthService, PlaylistService],
  controllers: [PlaylistController],
  exports: [PlaylistService],
})
export class PlaylistModule {}
