import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CronjobService {
  constructor() {
    this.logger.log('Cronjob initialized.');
  }

  private readonly logger = new Logger(CronjobService.name);
}
