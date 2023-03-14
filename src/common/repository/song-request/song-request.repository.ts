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
    if (!music || !music.isRequestable || !music.book.isRequestable)
      throw new BadRequestException();
    if (
      await this.songRequestRepository.exist({
        where: {
          viewer: { id: _userId },
          music: { id: _musicId },
          isCompleted: false,
        },
      })
    )
      throw new BadRequestException();

    const songRequest = new SongRequestEntity({
      viewer: { id: _userId },
      music: music,
      broadcaster: music.broadcaster,
      book: music.book,
    });
    await songRequest.save();
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

  findManySongRequestByBookId(_bookId: string) {
    return this.songRequestRepository.find({
      where: {
        book: {
          id: _bookId,
        },
        isCompleted: false,
      },
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

  findManyBlacklistUserByBookId(_bookId: string) {
    return this.songRequestBlacklistRepository.find({
      where: {
        book: {
          id: _bookId,
        },
      },
    });
  }
}
