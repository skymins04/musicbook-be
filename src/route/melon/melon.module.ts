import { Global, Module } from '@nestjs/common';
import { MelonService } from './melon.service';
import { MelonController } from './melon.controller';

@Global()
@Module({
  providers: [MelonService],
  exports: [MelonService],
  controllers: [MelonController],
})
export class MelonModule {}
