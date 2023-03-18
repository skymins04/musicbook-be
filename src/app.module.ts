import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ApiResponseInterceptor } from './common/api-response/api-response.interceptor';
import { JwtAuthModule } from './common/jwt-auth/jwt-auth.module';
import { UserModule } from './route/user/user.module';
import { RepositoryModule } from './common/repository/repository.module';
import { MusicModule } from './route/music/music.module';
import { MelonModule } from './route/melon/melon.module';
import { BookModule } from './route/book/book.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CloudflareModule } from './common/cloudflare/cloudflare.module';
import { RedisModule } from './common/redis/redis.module';
import { RequestModule } from './route/request/request.module';
import { CronjobModule } from './cronjob/cronjob.module';
import { CloudflareImagesService } from './common/cloudflare/cloudflare-images.service';
import { CloudflareR2Service } from './common/cloudflare/cloudflare-r2.service';
import {
  CloudflareStorage,
  getCloudflareStorage,
} from './common/multer/cloudflare-storage.engine';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        API_ADDRESS: Joi.string().required(),
        STATIC_SERVE_ROOT: Joi.string().required(),
        MYSQL_HOST: Joi.string().required(),
        MYSQL_PORT: Joi.number().required(),
        MYSQL_USERNAME: Joi.string().required(),
        MYSQL_PASSWORD: Joi.string().required(),
        MYSQL_DATABASE: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        TWITCH_CLIENT_ID: Joi.string().required(),
        TWITCH_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        CLOUDFLARE_ACCOUNT_ID: Joi.string().required(),
        CLOUDFLARE_IMAGES_TOKEN: Joi.string().required(),
        CLOUDFLARE_IMAGES_CDN_ADDRESS: Joi.string().required(),
        CLOUDFLARE_R2_ACCESS_KEY: Joi.string().required(),
        CLOUDFLARE_R2_SECRET_ACCESS_KEY: Joi.string().required(),
        CLOUDFLARE_R2_CDN_ADDRESS: Joi.string().required(),
      }),
    }),
    // MulterModule.registerAsync({
    //   imports: [CloudflareModule],
    //   inject: [CloudflareImagesService, CloudflareR2Service],
    //   useFactory: (
    //     cloudflareImagesService: CloudflareImagesService,
    //     cloudflareR2Service: CloudflareR2Service,
    //   ) => ({
    //     storage: getCloudflareStorage(
    //       cloudflareImagesService,
    //       cloudflareR2Service,
    //     ),
    //     limits: {
    //       fileSize: 50 * 1024 * 1024,
    //     },
    //   }),
    // }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', '.uploads'),
    //   serveRoot: `/${process.env.STATIC_SERVE_ROOT}`,
    // }),
    RedisModule,
    RepositoryModule,
    CloudflareModule,
    JwtAuthModule,
    CronjobModule,
    MelonModule,
    UserModule,
    MusicModule,
    BookModule,
    RequestModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
  ],
})
export class AppModule {}
