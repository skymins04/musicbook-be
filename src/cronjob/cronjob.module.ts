import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MusicbookLikeCountCronjob } from './musicbook-like-count.cron';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [MusicbookLikeCountCronjob],
  exports: [ScheduleModule],
})
export class CronjobModule {}
