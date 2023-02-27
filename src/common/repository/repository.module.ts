import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity';
import { UserTwitchEntity } from './user/user-twitch.entity';
import { UserGoogleEntity } from './user/user-google.entity';
import { UserRepositoryService } from './user/user-repository.service';

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
          entities: [UserEntity, UserTwitchEntity, UserGoogleEntity],
          synchronize: true,
          logging: false,
          keepConnectionAlive: true,
        };
      },
    }),
    TypeOrmModule.forFeature([UserEntity, UserTwitchEntity, UserGoogleEntity]),
  ],
  providers: [UserRepositoryService],
  exports: [TypeOrmModule, UserRepositoryService],
})
export class RepositoryModule {}