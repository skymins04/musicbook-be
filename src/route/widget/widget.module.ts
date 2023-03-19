import { Global, Module } from '@nestjs/common';
import { PlaylistModule } from './playlist/playlist.module';

@Global()
@Module({
  imports: [PlaylistModule],
  exports: [PlaylistModule],
})
export class WidgetModule {}
