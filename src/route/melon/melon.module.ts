import { Global, Module } from '@nestjs/common';
import { MelonService } from './melon.service';
import { MelonController } from './melon.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [MelonService, ConfigService],
  exports: [MelonService],
  controllers: [MelonController],
})
export class MelonModule {}
