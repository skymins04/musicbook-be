import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserTwitchEntity, UserTwitchEntityDTO } from './user-twitch.entity';
import { UserGoogleEntity, UserGoogleEntityDTO } from './user-google.entity';

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserTwitchEntity)
    private readonly userTwitchRepository: Repository<UserTwitchEntity>,
    @InjectRepository(UserGoogleEntity)
    private readonly userGoogleRepository: Repository<UserGoogleEntity>,
  ) {}

  createUserByTwitch(_twitch: UserTwitchEntity): Promise<UserEntity> {
    const user = new UserEntity();
    user.twitch = _twitch;
    user.displayName = _twitch.twitchDisplayName || _twitch.twitchLogin;
    user.profileImgURL = _twitch.twitchProfileImgURL;
    user.email = _twitch.twitchEmail;
    user.description = _twitch.twitchDescription;

    return this.userRepository.insert(user).then(() => user);
  }

  createUserByGoogle(_google: UserGoogleEntity): Promise<UserEntity> {
    const user = new UserEntity();
    user.google = _google;
    user.displayName = _google.googleDisplayName;
    user.profileImgURL = _google.googleProfileImgURL;
    user.email = _google.googleEmail;
    user.description = '';

    return this.userRepository.insert(user).then(() => user);
  }

  createOrUpdateTwitch(
    _twitch: Partial<UserTwitchEntityDTO>,
  ): Promise<UserTwitchEntity> {
    return this.userTwitchRepository
      .findOne({
        where: { twitchId: _twitch.twitchId },
        withDeleted: true,
      })
      .then((existingUserTwitch) => {
        if (existingUserTwitch) {
          for (const key of Object.keys(_twitch)) {
            existingUserTwitch[key] = _twitch[key];
          }
          return this.userTwitchRepository
            .update(
              { twitchId: _twitch.twitchId },
              { ..._twitch, deletedAt: null },
            )
            .then(() => existingUserTwitch);
        } else {
          return this.userTwitchRepository.save({
            ..._twitch,
            twitchId: _twitch.twitchId,
          });
        }
      });
  }

  createOrUpdateGoogle(
    _google: Partial<UserGoogleEntityDTO>,
  ): Promise<UserGoogleEntity> {
    return this.userGoogleRepository
      .findOne({
        where: { googleId: _google.googleId },
        withDeleted: true,
      })
      .then((exitstingUserGoogle) => {
        if (exitstingUserGoogle) {
          for (const key of Object.keys(_google)) {
            exitstingUserGoogle[key] = _google[key];
          }
          return this.userGoogleRepository
            .update(
              { googleId: _google.googleId },
              { ..._google, deletedAt: null },
            )
            .then(() => exitstingUserGoogle);
        } else {
          return this.userGoogleRepository.save({
            ..._google,
            googleId: _google.googleId,
          });
        }
      });
  }

  findOneTwitchById(_twitchId: string, _withDeleted: boolean) {
    return this.userTwitchRepository.findOne({
      where: { twitchId: _twitchId },
      withDeleted: _withDeleted,
    });
  }

  findOneGoogleById(_googleId: string, _withDeleted: boolean) {
    return this.userGoogleRepository.findOne({
      where: { googleId: _googleId },
      withDeleted: _withDeleted,
    });
  }

  findOneUserById(_id: string, _withDeleted: boolean) {
    return this.userRepository.findOne({
      where: { id: _id },
      relations: ['twitch', 'google'],
      withDeleted: _withDeleted,
    });
  }

  findOneUserByEmail(_email: string, _withDeleted: boolean) {
    return this.userRepository.findOne({
      where: { email: _email },
      relations: ['twitch', 'google'],
      withDeleted: _withDeleted,
    });
  }

  findOneUserByTwitchId(_twitchId: string, _withDeleted: boolean) {
    return this.userRepository.findOne({
      where: { twitch: { twitchId: _twitchId } },
      relations: ['twitch', 'google'],
      withDeleted: _withDeleted,
    });
  }

  findOneUserByTwitchEntity(
    _twitch: UserTwitchEntityDTO,
    _withDeleted: boolean,
  ) {
    return this.userRepository.findOne({
      where: [
        { email: _twitch.twitchEmail },
        { twitch: { twitchId: _twitch.twitchId } },
      ],
      relations: ['twitch', 'google'],
      withDeleted: _withDeleted,
    });
  }

  findOneUserByGoogleId(_googleId: string, _withDeleted: boolean) {
    return this.userRepository.findOne({
      where: { google: { googleId: _googleId } },
      relations: ['twitch', 'google'],
      withDeleted: _withDeleted,
    });
  }

  findOneUserByGoogleEntity(
    _google: UserGoogleEntityDTO,
    _withDeleted: boolean,
  ) {
    return this.userRepository.findOne({
      where: [
        { email: _google.googleEmail },
        { google: { googleId: _google.googleId } },
      ],
      relations: ['twitch', 'google'],
      withDeleted: _withDeleted,
    });
  }

  async deteleUser(_id: string) {
    const user = await this.userRepository.findOne({
      where: { id: _id },
      relations: ['twitch', 'google'],
    });
    if (user) {
      await this.userTwitchRepository.softRemove(user.twitch);
      await this.userGoogleRepository.softRemove(user.google);
      await this.userRepository.softRemove(user);
    }
  }
}
