import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisModule as IORedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisMusicRequestService } from './redis-music-request.service';

@Global()
@Module({
  imports: [
    IORedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        config: {
          host: config.get('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
          password: config.get('REDIS_PASSWORD'),
        },
      }),
    }),
  ],
  providers: [RedisService, RedisMusicRequestService],
  exports: [IORedisModule, RedisService, RedisMusicRequestService],
})
export class RedisModule {}
