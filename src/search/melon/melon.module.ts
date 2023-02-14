import { Module } from '@nestjs/common';
import { MelonService } from './melon.service';

@Module({
  providers: [MelonService],
  exports: [MelonService],
})
export class MelonModule {}
