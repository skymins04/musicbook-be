import { Global, Module } from '@nestjs/common';
import { MelonService } from './melon.service';
import { MusicBookSourceRepository } from 'src/common/repository/musicbook/musicbook-source.repository';
import { MelonController } from './melon.controller';

@Global()
@Module({
  providers: [MelonService, MusicBookSourceRepository],
  exports: [MelonService],
  controllers: [MelonController],
})
export class MelonModule {}
