import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MusicLikeCountEntity } from './music-like-count.entity';
import { Between, Repository } from 'typeorm';
import { BookLikeCountEntity } from './book-like-count.entity';
import { MusicBookLikeRepository } from './musicbook-like.repository';
import { MusicBookRepository } from './musicbook.repository';

@Injectable()
export class MusicBookLikeCountRepository {
  constructor(
    @InjectRepository(MusicLikeCountEntity)
    private readonly musicLikeCountRepository: Repository<MusicLikeCountEntity>,
    @InjectRepository(BookLikeCountEntity)
    private readonly bookLikeCountRepository: Repository<BookLikeCountEntity>,
    private readonly musicbookRepository: MusicBookRepository,
    private readonly musicbookLikeRespository: MusicBookLikeRepository,
  ) {}

  async createMusicLikeCountSnapshot(_musicId: string, _snapshotPoint: Date) {
    const snapshot = new MusicLikeCountEntity();
    const music = await this.musicbookRepository.findOneMusicById(_musicId);
    const musicLikeCount =
      await this.musicbookLikeRespository.getCountMusicLikeByMusicId(
        _musicId,
        _snapshotPoint,
      );
    snapshot.count = musicLikeCount;
    snapshot.broadcaster = music.broadcaster;
    snapshot.book = music.book;
    snapshot.music = music;
    await snapshot.save();
  }

  findOneMusicLikeCountById(_id: number) {
    return this.musicLikeCountRepository.findOne({ where: { id: _id } });
  }

  findManyMusicLikeCount(_musicId: string) {
    return this.musicLikeCountRepository.find({
      where: { music: { id: _musicId } },
    });
  }

  findManyMusicLikeCountByDate(_musicId: string, _start: Date, _end: Date) {
    return this.musicLikeCountRepository.find({
      where: { music: { id: _musicId }, createdAt: Between(_start, _end) },
    });
  }

  async deleteMusicLikeCountById(_id: number) {
    await this.musicLikeCountRepository.delete(_id);
  }

  async createBookLikeCountSnapshot(_bookId: string, _snapshotPoint: Date) {
    const snapshot = new BookLikeCountEntity();
    const book = await this.musicbookRepository.findOneBookById(_bookId);
    const bookLikeCount =
      await this.musicbookLikeRespository.getCountBookLikeByBookId(
        _bookId,
        _snapshotPoint,
      );
    snapshot.count = bookLikeCount;
    snapshot.broadcaster = book.broadcaster;
    snapshot.book = book;
    await snapshot.save();
  }

  findOneBookLikeCountById(_id: number) {
    return this.bookLikeCountRepository.findOne({ where: { id: _id } });
  }

  findManyBookLikeCount(_bookId: string) {
    return this.bookLikeCountRepository.find({
      where: { book: { id: _bookId } },
    });
  }

  findManyBookLikeCountByDate(_bookId: string, _start: Date, _end: Date) {
    return this.bookLikeCountRepository.find({
      where: { book: { id: _bookId }, createdAt: Between(_start, _end) },
    });
  }

  async deleteBookLikeCountById(_id: number) {
    await this.bookLikeCountRepository.delete(_id);
  }
}
