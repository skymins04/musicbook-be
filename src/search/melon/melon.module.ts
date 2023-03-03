import { Module } from '@nestjs/common';
import { MelonService } from './melon.service';
import { MusicBookSourceRepositoryService } from 'src/common/repository/musicbook/musicbook-source-repository.service';

@Module({
  providers: [MelonService, MusicBookSourceRepositoryService],
  exports: [MelonService],
})
export class MelonModule {}
