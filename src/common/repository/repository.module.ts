import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity';
import { UserTwitchEntity } from './user/user-twitch.entity';
import { UserGoogleEntity } from './user/user-google.entity';
import { UserRepository } from './user/user.repository';
import { MusicEntity } from './musicbook/music.entity';
import { BookEntity } from './musicbook/book.entity';
import { MusicLikeEntity } from './musicbook/music-like.entity';
import { BookLikeEntity } from './musicbook/book-like.entity';
import { MusicLikeCountEntity } from './musicbook/music-like-count.entity';
import { BookLikeCountEntity } from './musicbook/book-like-count.entity';
import { MusicBookRepository } from './musicbook/musicbook.repository';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { MusicSourceMelonEntity } from './musicbook/music-source-melon.entity';
import { MusicSourceOriginalEntity } from './musicbook/music-source-original.entity';
import { MusicBookSourceRepository } from './musicbook/musicbook-source.repository';
import { MusicBookLikeRepository } from './musicbook/musicbook-like.repository';
import { SongRequestEntity } from './song-request/song-request.entity';
import { SongRequestBlacklistEntity } from './song-request/song-request-blacklist.entity';
import { SongRequestRepository } from './song-request/song-request.repository';
import { MusicBookLikeCountRepository } from './musicbook/musicbook-like-count.repository';
import { WidgetPlaylistEntity } from './widget-playlist/widget-playlist.entity';
import { WidgetPlaylistRepository } from './widget-playlist/widget-playlist.repository';

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
            MusicSourceOriginalEntity,
            MusicSourceMelonEntity,
            BookEntity,
            MusicLikeEntity,
            BookLikeEntity,
            MusicLikeCountEntity,
            BookLikeCountEntity,
            SongRequestEntity,
            SongRequestBlacklistEntity,
            WidgetPlaylistEntity,
          ],
          synchronize: false,
          logging: config.get('NODE_ENV') === 'development',
          keepConnectionAlive: config.get('NODE_ENV') === 'development',
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      UserTwitchEntity,
      UserGoogleEntity,
      MusicEntity,
      MusicSourceOriginalEntity,
      MusicSourceMelonEntity,
      BookEntity,
      MusicLikeEntity,
      BookLikeEntity,
      MusicLikeCountEntity,
      BookLikeCountEntity,
      SongRequestEntity,
      SongRequestBlacklistEntity,
      WidgetPlaylistEntity,
    ]),
  ],
  providers: [
    UserRepository,
    MusicBookRepository,
    MusicBookSourceRepository,
    MusicBookLikeRepository,
    MusicBookLikeCountRepository,
    SongRequestRepository,
    WidgetPlaylistRepository,
  ],
  exports: [
    TypeOrmModule,
    UserRepository,
    MusicBookRepository,
    MusicBookSourceRepository,
    MusicBookLikeRepository,
    MusicBookLikeCountRepository,
    SongRequestRepository,
    WidgetPlaylistRepository,
  ],
})
export class RepositoryModule {}
