import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async getHello() {
    return `Hello World!: ${process.pid} ${await this.redis.get('test')}`;
  }
}
