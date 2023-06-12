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
import { CloudflareModule } from './common/cloudflare/cloudflare.module';
import { RedisModule } from './common/redis/redis.module';
import { RequestModule } from './route/request/request.module';
import { CronjobModule } from './cronjob/cronjob.module';
import { CloudflareMulterModule } from './common/cloudflare-multer/cloudflare-multer.module';
import { WidgetModule } from './route/widget/widget.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        API_ADDRESS: Joi.string().required(),
        API_PORT: Joi.number().required(),
        LOGIN_REDIRECT_ADDRESS: Joi.string().required(),
        ROOT_DOMAIN: Joi.string().required(),
        MYSQL_HOST: Joi.string().required(),
        MYSQL_PORT: Joi.number().required(),
        MYSQL_USERNAME: Joi.string().required(),
        MYSQL_PASSWORD: Joi.string().required(),
        MYSQL_DATABASE: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
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
    CloudflareMulterModule,
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
    WidgetModule,
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
