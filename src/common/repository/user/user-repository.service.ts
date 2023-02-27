import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserTwitchEntity, UserTwitchEntityDTO } from './user-twitch.entity';

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserTwitchEntity)
    private readonly userTwitchRepository: Repository<UserTwitchEntity>,
  ) {}

  createUserByTwitch(_twitch: UserTwitchEntity): Promise<UserEntity> {
    const user = new UserEntity();
    user.twitch = _twitch;
    user.displayName = _twitch.twitchDisplayName || _twitch.twitchName;
    user.profileImgURL = _twitch.twitchProfileImgURL;
    user.email = _twitch.twitchEmail;
    user.description = _twitch.twitchDescription;

    return this.userRepository.insert(user).then(() => user);
  }

  createOrUpdateUserTwitch(
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
            .update({ twitchId: _twitch.twitchId }, _twitch)
            .then(() => existingUserTwitch);
        } else {
          return this.userTwitchRepository.save({
            ..._twitch,
            twitchId: _twitch.twitchId,
            deletedAt: null,
          });
        }
      });
  }

  async findOneUserById(_id: string, _withDeleted: boolean) {
    return await this.userRepository.findOne({
      where: { id: _id },
      withDeleted: _withDeleted,
    });
  }

  async findOneUserByEmail(_email: string, _withDeleted: boolean) {
    return await this.userRepository.findOne({
      where: { email: _email },
      withDeleted: _withDeleted,
    });
  }

  async findOneUserByTwitchId(_twitchId: number, _withDeleted: boolean) {
    return await this.userRepository.findOne({
      where: { twitch: { twitchId: _twitchId } },
      withDeleted: _withDeleted,
    });
  }

  async findOneUserByTwitchEntity(
    _twitch: UserTwitchEntityDTO,
    _withDeleted: boolean,
  ) {
    return await this.userRepository.findOne({
      where: [
        { email: _twitch.twitchEmail },
        { twitch: { twitchId: _twitch.twitchId } },
      ],
      withDeleted: _withDeleted,
    });
  }

  async deteleUser(_id: string) {
    const user = await this.userRepository.findOne({
      where: { id: _id },
      relations: ['twitch'],
    });
    if (user) {
      await this.userTwitchRepository.softRemove(user.twitch);
      await this.userRepository.softRemove(user);
    }
  }
}
