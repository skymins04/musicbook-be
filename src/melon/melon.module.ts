import { Global, Module } from '@nestjs/common';
import { MelonService } from './melon.service';
import { MusicBookSourceRepositoryService } from 'src/common/repository/musicbook/musicbook-source-repository.service';
import { MelonController } from './melon.controller';

@Global()
@Module({
  providers: [MelonService, MusicBookSourceRepositoryService],
  exports: [MelonService],
  controllers: [MelonController],
})
export class MelonModule {}
