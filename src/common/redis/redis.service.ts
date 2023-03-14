import { InjectRedis } from '@nestjs-modules/ioredis';
import { BadRequestException, Injectable } from '@nestjs/common';
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

  async rpushItemOfMusicRequestQueue(
    _bookId: string,
    req_id: number,
    music_id: string,
  ) {
    await this.redisClient.rpush(
      `music:request:${_bookId}`,
      JSON.stringify({ req_id, music_id }),
    );
  }

  async lpopItemOfMusicRequestQueue(
    _bookId: string,
  ): Promise<{ req_id: number; music_id: string }> {
    const itm = await this.redisClient.lpop(`music:request:${_bookId}`);
    return JSON.parse(itm);
  }

  async getMusicRequestQueue(
    _bookId: string,
  ): Promise<{ req_id: number; music_id: string }[]> {
    const queue = await this.redisClient.lrange(
      `music:request:${_bookId}`,
      0,
      -1,
    );
    return queue.map((itm) => JSON.parse(itm));
  }

  async clearMusicRequestQueue(_bookId: string) {
    await this.redisClient.del(`music:request:${_bookId}`);
  }

  async removeItemInMusicRequestQueue(_bookId: string, _idx: number) {
    const key = `music:request:${_bookId}`;
    const itm = await this.redisClient.lindex(key, _idx);
    if (itm) await this.redisClient.lrem(key, 1, itm);
    else throw new BadRequestException();
  }

  async shiftUpItemInMusicRequestQueue(_bookId: string, _idx: number) {
    const key = `music:request:${_bookId}`;
    if (_idx <= 0) throw new BadRequestException();
    const valueItm = await this.redisClient.lindex(key, _idx);
    const pivotItm = await this.redisClient.lindex(key, _idx - 1);
    if (valueItm && pivotItm) {
      await this.redisClient.lrem(key, 1, valueItm);
      await this.redisClient.linsert(key, 'BEFORE', pivotItm, valueItm);
    } else throw new BadRequestException();
  }

  async shiftDownItemInMusicRequestQueue(_bookId: string, _idx: number) {
    const key = `music:request:${_bookId}`;
    const queueLength = await this.redisClient.llen(key);
    if (_idx >= queueLength - 1) throw new BadRequestException();
    const valueItm = await this.redisClient.lindex(key, _idx);
    const pivotItm = await this.redisClient.lindex(key, _idx + 1);
    if (valueItm && pivotItm) {
      await this.redisClient.lrem(key, 1, valueItm);
      await this.redisClient.linsert(key, 'AFTER', pivotItm, valueItm);
    } else throw new BadRequestException();
  }
}
