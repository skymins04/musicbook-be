import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './common/redis/redis-io.adapter';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { UserModule } from './route/user/user.module';
import * as fs from 'fs';
import { MusicModule } from './route/music/music.module';
import { MelonModule } from './route/melon/melon.module';
import { BookModule } from './route/book/book.module';
import * as dotenv from 'dotenv';
import { RequestModule } from './route/request/request.module';
import { PlaylistModule } from './route/widget/playlist/playlist.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
  });
  app.use(cookieParser());
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  const swaggerDocument = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('노래책 API')
      .setDescription('지상최고의 음악방송 오버레이 서비스, 노래책 Backend API')
      .setVersion('1')
      .addBearerAuth()
      .build(),
    {
      include: [
        UserModule,
        MelonModule,
        MusicModule,
        BookModule,
        RequestModule,
        PlaylistModule,
      ],
    },
  );
  SwaggerModule.setup('docs', app, swaggerDocument);
  if (process.env.NODE_ENV !== 'production')
    fs.writeFileSync('./swagger-spec.json', JSON.stringify(swaggerDocument));

  await app.listen(process.env.API_PORT);
}
bootstrap();
