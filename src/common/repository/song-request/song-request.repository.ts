import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SongRequestEntity } from './song-request.entity';
import { Repository } from 'typeorm';
import { SongRequestBlacklistEntity } from './song-request-blacklist.entity';
import { MusicBookRepository } from '../musicbook/musicbook.repository';

@Injectable()
export class SongRequestRepository {
  constructor(
    @InjectRepository(SongRequestEntity)
    private readonly songRequestRepository: Repository<SongRequestEntity>,
    @InjectRepository(SongRequestBlacklistEntity)
    private readonly songRequestBlacklistRepository: Repository<SongRequestBlacklistEntity>,
    private readonly musicbookRepository: MusicBookRepository,
  ) {}

  async createSongRequest(_userId: string, _musicId: string) {
    const music = await this.musicbookRepository.findOneMusicById(_musicId, {
      withJoin: ['broadcaster', 'book'],
    });
    const songRequests = await this.findManySongRequestByBookId(music.book.id);

    if (
      !music ||
      music.isHide ||
      music.book.isHide ||
      !music.isAllowRequest ||
      !music.book.isAllowRequest ||
      (music.book.isAllowRequest &&
        music.book.requestLimitCount >= 0 &&
        songRequests.length >= music.book.requestLimitCount) ||
      (!music.book.isAllowDuplicateRequest &&
        songRequests.filter(
          (x) => x.viewer.id === _userId && x.music.id === _musicId,
        ).length !== 0) ||
      (await this.findOneBlacklistUser(music.book.id, _userId))
    )
      throw new BadRequestException();

    const songRequest = new SongRequestEntity({
      viewer: { id: _userId },
      music: music,
      broadcaster: music.broadcaster,
      book: music.book,
    });

    return {
      music,
      songRequest: await this.songRequestRepository.save(songRequest),
    };
  }

  async deleteSongRequestByViewerId(_requestId: number, _viewerId: string) {
    const result = await this.songRequestRepository.delete({
      id: _requestId,
      viewer: { id: _viewerId },
    });
    if (!result.affected) throw new BadRequestException();
  }

  async deleteSongRequestByBroadcasterId(
    _requestId: number,
    _broadcasterId: string,
  ) {
    const result = await this.songRequestRepository.delete({
      id: _requestId,
      broadcaster: { id: _broadcasterId },
    });
    if (!result.affected) throw new BadRequestException();
  }

  findOneSongRequestById(
    _requestId: number,
    _options?: {
      withJoin?: boolean | ('viewer' | 'broadcaster' | 'music' | 'book')[];
    },
  ) {
    return this.songRequestRepository.findOne({
      where: {
        id: _requestId,
      },
      relations:
        _options?.withJoin === undefined
          ? []
          : typeof _options.withJoin === 'boolean'
          ? ['viewer', 'broadcaster', 'music', 'book']
          : _options.withJoin,
    });
  }

  findManySongRequestByIds(_requestIds: number[]) {
    return this.songRequestRepository.find({
      where: _requestIds.map((x) => ({ id: x })),
      relations: ['viewer', 'broadcaster', 'music', 'book'],
    });
  }

  findManySongRequestByBookId(_bookId: string) {
    return this.songRequestRepository.find({
      where: {
        book: {
          id: _bookId,
        },
        isCompleted: false,
      },
      relations: ['viewer', 'broadcaster', 'music', 'book'],
    });
  }

  findManySongRequestByViewerId(_viewerId: string) {
    return this.songRequestRepository.find({
      where: {
        viewer: {
          id: _viewerId,
        },
        isCompleted: false,
      },
      relations: ['viewer', 'broadcaster', 'music', 'book'],
    });
  }

  findManySongRequestByBroadcasterId(_broadcasterId: string) {
    return this.songRequestRepository.find({
      where: {
        broadcaster: {
          id: _broadcasterId,
        },
        isCompleted: false,
      },
      relations: ['viewer', 'broadcaster', 'music', 'book'],
    });
  }

  async createBlacklistUser(_userId: string, _bookId: string) {
    const blacklistUser = new SongRequestBlacklistEntity({
      user: { id: _userId },
      book: { id: _bookId },
    });
    await blacklistUser.save();
  }

  async deleteBlacklistUser(_userId: string, _bookId: string) {
    const result = await this.songRequestBlacklistRepository.delete({
      user: { id: _userId },
      book: { id: _bookId },
    });
    if (!result.affected) throw new BadRequestException();
  }

  findOneBlacklistUser(_bookId: string, _userId: string) {
    return this.songRequestBlacklistRepository.findOne({
      where: {
        book: {
          id: _bookId,
        },
        user: {
          id: _userId,
        },
      },
    });
  }

  findManyBlacklistUserByBookId(_bookId: string) {
    return this.songRequestBlacklistRepository.find({
      where: {
        book: {
          id: _bookId,
        },
      },
      relations: ['user'],
    });
  }
}
