import { Global, Module } from '@nestjs/common';
import { JwtAuthService } from 'src/common/jwt-auth/jwt-auth.service';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { PlaylistGateway } from './playlist.gateway';

@Global()
@Module({
  providers: [JwtAuthService, PlaylistService, PlaylistGateway],
  controllers: [PlaylistController],
  exports: [PlaylistGateway],
})
export class PlaylistModule {}
