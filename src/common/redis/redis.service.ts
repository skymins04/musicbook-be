import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { TooManyRequestsException } from '../api-response/api-response-exceptions';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async checkRequestCooltime(_key: string, _limit: number, _cooltime: number) {
    const count = await this.redisClient.get(_key);
    if (count === null || parseInt(count) < _limit) {
      await this.redisClient.incr(_key);
    } else throw new TooManyRequestsException();
    if (count === null) await this.redisClient.expire(_key, _cooltime);
  }
}
