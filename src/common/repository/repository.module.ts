import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity';
import { UserTwitchEntity } from './user/user-twitch.entity';
import { UserGoogleEntity } from './user/user-google.entity';
import { UserRepositoryService } from './user/user-repository.service';
import { MusicEntity } from './musicbook/music.entity';
import { BookEntity } from './musicbook/book.entity';
import { MusicLikeEntity } from './musicbook/music-like.entity';
import { BookLikeEntity } from './musicbook/book-like.entity';
import { MusicLikeCountEntity } from './musicbook/music-like-count.entity';
import { BookLikeCountEntity } from './musicbook/book-like-count.entity';
import { MusicBookRepositoryService } from './musicbook/musicbook-repository.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          host: config.get('MYSQL_HOST'),
          port: config.get<number>('MYSQL_PORT'),
          username: config.get('MYSQL_USERNAME'),
          password: config.get('MYSQL_PASSWORD'),
          database: config.get('MYSQL_DATABASE'),
          entities: [
            UserEntity,
            UserTwitchEntity,
            UserGoogleEntity,
            MusicEntity,
            BookEntity,
            MusicLikeEntity,
            BookLikeEntity,
            MusicLikeCountEntity,
            BookLikeCountEntity,
          ],
          synchronize: false,
          logging: true,
          keepConnectionAlive: true,
        };
      },
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      UserTwitchEntity,
      UserGoogleEntity,
      MusicEntity,
      BookEntity,
      MusicLikeEntity,
      BookLikeEntity,
      MusicLikeCountEntity,
      BookLikeCountEntity,
    ]),
  ],
  providers: [UserRepositoryService, MusicBookRepositoryService],
  exports: [TypeOrmModule, UserRepositoryService, MusicBookRepositoryService],
})
export class RepositoryModule {}
