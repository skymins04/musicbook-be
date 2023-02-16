import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { ApiResponseDataDTO } from './common/api-response/api-response-data.dto';

@Injectable()
export class AppService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async getHello() {
    return new ApiResponseDataDTO('hello world');
  }
}
