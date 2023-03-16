import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class MusicbookLikeCountCronjob {
  constructor() {
    this.logger.log(MusicbookLikeCountCronjob.name, 'initialized.');
  }

  private readonly logger = new Logger(MusicbookLikeCountCronjob.name);
}
