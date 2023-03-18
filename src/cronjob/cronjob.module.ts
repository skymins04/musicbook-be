import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MetricCollectionCron } from './metric-collection.cron';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [MetricCollectionCron],
  exports: [ScheduleModule],
})
export class CronjobModule {}
