import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserTwitchEntity } from './user-twitch.entity';
import { UserGoogleEntity } from './user-google.entity';

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

  async updateUser(
    _where:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | FindOptionsWhere<UserEntity>,
    _user: DeepPartial<UserEntity>,
  ) {
    await this.userRepository.update(_where, _user);
  }

  createOrUpdateTwitch(
    _twitch: DeepPartial<UserTwitchEntity>,
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
    _google: DeepPartial<UserGoogleEntity>,
  ): Promise<UserGoogleEntity> {
    return this.userGoogleRepository
      .findOne({
        where: { googleId: _google.googleId },
        withDeleted: true,
      })
      .then((existingUserGoogle) => {
        if (existingUserGoogle) {
          for (const key of Object.keys(_google)) {
            existingUserGoogle[key] = _google[key];
          }
          return this.userGoogleRepository
            .update(
              { googleId: _google.googleId },
              { ..._google, deletedAt: null },
            )
            .then(() => existingUserGoogle);
        } else {
          return this.userGoogleRepository.save({
            ..._google,
            googleId: _google.googleId,
          });
        }
      });
  }

  findOneTwitchById(_twitchId: string, _options?: { withDeleted?: boolean }) {
    return this.userTwitchRepository.findOne({
      where: { twitchId: _twitchId },
      withDeleted: _options?.withDeleted,
    });
  }

  findOneGoogleById(_googleId: string, _options?: { withDeleted?: boolean }) {
    return this.userGoogleRepository.findOne({
      where: { googleId: _googleId },
      withDeleted: _options?.withDeleted,
    });
  }

  findOneUserById(
    _id: string,
    _options?: { withDeleted?: boolean; withJoin?: boolean },
  ) {
    return this.userRepository.findOne({
      where: { id: _id },
      relations:
        _options?.withDeleted === undefined || _options?.withDeleted
          ? ['twitch', 'google']
          : [],
      withDeleted: _options?.withDeleted,
    });
  }

  findOneUserByEmail(
    _email: string,
    _options?: { withDeleted?: boolean; withJoin?: boolean },
  ) {
    return this.userRepository.findOne({
      where: { email: _email },
      relations:
        _options?.withDeleted === undefined || _options?.withDeleted
          ? ['twitch', 'google']
          : [],
      withDeleted: _options?.withDeleted,
    });
  }

  findOneUserByTwitchId(
    _twitchId: string,
    _options?: { withDeleted?: boolean; withJoin?: boolean },
  ) {
    return this.userRepository.findOne({
      where: { twitch: { twitchId: _twitchId } },
      relations:
        _options?.withDeleted === undefined || _options?.withDeleted
          ? ['twitch', 'google']
          : [],
      withDeleted: _options?.withDeleted,
    });
  }

  findOneUserByTwitchEntity(
    _twitch: UserTwitchEntity,
    _options?: { withDeleted?: boolean; withJoin?: boolean },
  ) {
    return this.userRepository.findOne({
      where: [
        { email: _twitch.twitchEmail },
        { twitch: { twitchId: _twitch.twitchId } },
      ],
      relations:
        _options?.withDeleted === undefined || _options?.withDeleted
          ? ['twitch', 'google']
          : [],
      withDeleted: _options?.withDeleted,
    });
  }

  findOneUserByGoogleId(
    _googleId: string,
    _options?: { withDeleted?: boolean; withJoin?: boolean },
  ) {
    return this.userRepository.findOne({
      where: { google: { googleId: _googleId } },
      relations:
        _options?.withDeleted === undefined || _options?.withDeleted
          ? ['twitch', 'google']
          : [],
      withDeleted: _options?.withDeleted,
    });
  }

  findOneUserByGoogleEntity(
    _google: UserGoogleEntity,
    _options?: { withDeleted?: boolean; withJoin?: boolean },
  ) {
    return this.userRepository.findOne({
      where: [
        { email: _google.googleEmail },
        { google: { googleId: _google.googleId } },
      ],
      relations:
        _options?.withDeleted === undefined || _options?.withDeleted
          ? ['twitch', 'google']
          : [],
      withDeleted: _options?.withDeleted,
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
