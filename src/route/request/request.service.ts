import { BadRequestException, Injectable } from '@nestjs/common';
import { RedisService } from 'src/common/redis/redis.service';
import { MusicBookRepository } from 'src/common/repository/musicbook/musicbook.repository';
import { SongRequestEntity } from 'src/common/repository/song-request/song-request.entity';
import { SongRequestRepository } from 'src/common/repository/song-request/song-request.repository';

@Injectable()
export class RequestService {
  constructor(
    private readonly redisService: RedisService,
    private readonly songRequestRepository: SongRequestRepository,
    private readonly musicbookRepository: MusicBookRepository,
  ) {}

  async createSongRequest(_jwt: MusicbookJwtPayload, _musicId: string) {
    const { music, songRequest } =
      await this.songRequestRepository.createSongRequest(_jwt.id, _musicId);
    await this.redisService.rpushItemOfMusicRequestQueue(
      music.book.id,
      songRequest.id,
      music.id,
    );
  }

  async deleteSongRequest(_jwt: MusicbookJwtPayload, _requestId: number) {
    const songRequest = await this.songRequestRepository.findOneSongRequestById(
      _requestId,
      { withJoin: ['viewer', 'broadcaster', 'book'] },
    );
    if (
      !songRequest ||
      (songRequest.viewer.id !== _jwt.id &&
        songRequest.broadcaster.id !== _jwt.id)
    )
      throw new BadRequestException();

    const queue = await this.redisService.getMusicRequestQueue(
      songRequest.book.id,
    );
    await songRequest.remove();
    await this.redisService.removeItemInMusicRequestQueue(
      songRequest.book.id,
      queue.map((x) => x.req_id).indexOf(_requestId),
    );
  }

  getMySongRequests(_jwt: MusicbookJwtPayload) {
    return this.songRequestRepository.findManySongRequestByViewerId(_jwt.id);
  }

  async getSongRequestQueue(_bookId: string) {
    if (!(await this.musicbookRepository.existBookById(_bookId)))
      throw new BadRequestException();

    const queueReqIds = (
      await this.redisService.getMusicRequestQueue(_bookId)
    ).map((x) => x.req_id);
    const queue: SongRequestEntity[] = new Array(queueReqIds.length);
    const queueData = await this.songRequestRepository.findManySongRequestByIds(
      queueReqIds,
    );
    if (queueReqIds.length !== queueData.length)
      throw new BadRequestException();

    queueData.forEach((itm) => {
      queue[queueReqIds.indexOf(itm.id)] = itm;
    });

    return queue;
  }

  async getMySongRequestQueue(_jwt: MusicbookJwtPayload) {
    const book = await this.musicbookRepository.findOneBookByUserId(_jwt.id);
    if (!book) throw new BadRequestException();

    const queueReqIds = (
      await this.redisService.getMusicRequestQueue(book.id)
    ).map((x) => x.req_id);
    const queue: SongRequestEntity[] = new Array(queueReqIds.length);
    const queueData = await this.songRequestRepository.findManySongRequestByIds(
      queueReqIds,
    );
    if (queueReqIds.length !== queueData.length)
      throw new BadRequestException();

    queueData.forEach((itm) => {
      queue[queueReqIds.indexOf(itm.id)] = itm;
    });

    return queue;
  }

  async recoverMySongRequestQueue(_jwt: MusicbookJwtPayload) {
    const book = await this.musicbookRepository.findOneBookByUserId(_jwt.id);
    if (!book) throw new BadRequestException();

    await this.redisService.clearMusicRequestQueue(book.id);
    const songRequests =
      await this.songRequestRepository.findManySongRequestByBookId(book.id);
    for (const songRequest of songRequests) {
      await this.redisService.rpushItemOfMusicRequestQueue(
        book.id,
        songRequest.id,
        songRequest.music.id,
      );
    }
  }

  async getSongRequestBlacklist(_jwt: MusicbookJwtPayload) {
    const book = await this.musicbookRepository.findOneBookByUserId(_jwt.id);
    if (!book) throw new BadRequestException();

    return this.songRequestRepository.findManyBlacklistUserByBookId(book.id);
  }

  async addUserToSongRequestBlacklist(
    _jwt: MusicbookJwtPayload,
    _userId: string,
  ) {
    if (_jwt.id === _userId) throw new BadRequestException();
    const book = await this.musicbookRepository.findOneBookByUserId(_jwt.id);
    if (!book) throw new BadRequestException();

    await this.songRequestRepository.createBlacklistUser(_userId, book.id);
  }

  async removeUserToSongRequest(_jwt: MusicbookJwtPayload, _userId: string) {
    const book = await this.musicbookRepository.findOneBookByUserId(_jwt.id);
    if (!book) throw new BadRequestException();

    await this.songRequestRepository.deleteBlacklistUser(_userId, book.id);
  }

  async moveUpSongRequest(_jwt: MusicbookJwtPayload, _requestId: number) {
    const book = await this.musicbookRepository.findOneBookByUserId(_jwt.id);
    if (!book) throw new BadRequestException();

    const queueIds = (
      await this.redisService.getMusicRequestQueue(book.id)
    ).map((x) => x.req_id);
    await this.redisService.shiftUpItemInMusicRequestQueue(
      book.id,
      queueIds.indexOf(_requestId),
    );
  }

  async moveDownSongRequest(_jwt: MusicbookJwtPayload, _requestId: number) {
    const book = await this.musicbookRepository.findOneBookByUserId(_jwt.id);
    if (!book) throw new BadRequestException();

    const queueIds = (
      await this.redisService.getMusicRequestQueue(book.id)
    ).map((x) => x.req_id);
    await this.redisService.shiftDownItemInMusicRequestQueue(
      book.id,
      queueIds.indexOf(_requestId),
    );
  }
}
