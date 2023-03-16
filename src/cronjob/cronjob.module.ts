import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobService } from './cronjob.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CronjobService],
  exports: [ScheduleModule],
})
export class CronjobModule {}
