import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MusicLikeEntity } from './music-like.entity';
import { Repository } from 'typeorm';
import { MusicLikeCountEntity } from './music-like-count.entity';
import { BookLikeEntity } from './book-like.entity';
import { BookLikeCountEntity } from './book-like-count.entity';
import { MusicBookRepository } from './musicbook.repository';

@Injectable()
export class MusicBookLikeRepository {
  constructor(
    @InjectRepository(MusicLikeEntity)
    private readonly musicLikeRepository: Repository<MusicLikeEntity>,
    @InjectRepository(MusicLikeCountEntity)
    private readonly musicLikeCountRepository: Repository<MusicLikeCountEntity>,
    @InjectRepository(BookLikeEntity)
    private readonly bookLikeRepository: Repository<BookLikeEntity>,
    @InjectRepository(BookLikeCountEntity)
    private readonly bookLikeCountRepository: Repository<BookLikeCountEntity>,
    private readonly musicbookRepository: MusicBookRepository,
  ) {}

  async createMusicLike(_userId: string, _musicId: string) {
    const isExistingLike = await this.musicLikeRepository.exist({
      where: { viewer: { id: _userId }, music: { id: _musicId } },
    });
    if (isExistingLike) throw new BadRequestException();
    const music = await this.musicbookRepository.findOneMusicById(_musicId, {
      withJoin: ['book'],
    });
    if (!music || !music.book) throw new BadRequestException();

    const like = new MusicLikeEntity();
    like.viewer.id = _userId;
    like.book = music.book;
    like.music = music;
    await like.save();
  }

  async deleteMusicLike(_userId: string, _musicId: string) {
    await this.musicLikeRepository
      .delete({
        viewer: { id: _userId },
        music: { id: _musicId },
      })
      .then((res) => {
        if (!res.affected) throw new BadRequestException();
      });
  }

  findOneMusicLike(_userId: string, _musicId: string) {
    return this.musicLikeRepository.findOne({
      where: { viewer: { id: _userId }, music: { id: _musicId } },
    });
  }

  findManyMusicLikeByUserId(_userId: string) {
    return this.musicLikeRepository.find({
      where: { viewer: { id: _userId } },
    });
  }

  findManyMusicLikeByMusicId(_musicId: string) {
    return this.musicLikeRepository.find({
      where: { music: { id: _musicId } },
    });
  }

  async createBookLike(_userId: string, _bookId: string) {
    const isExistingLike = await this.bookLikeRepository.exist({
      where: { viewer: { id: _userId }, book: { id: _bookId } },
    });
    if (isExistingLike) throw new BadRequestException();

    const like = new MusicLikeEntity();
    like.viewer.id = _userId;
    like.book.id = _bookId;
    await like.save();
  }

  async deleteBookLike(_userId: string, _bookId: string) {
    await this.bookLikeRepository
      .delete({
        viewer: { id: _userId },
        book: { id: _bookId },
      })
      .then((res) => {
        if (!res.affected) throw new BadRequestException();
      });
  }

  findOneBookLike(_userId: string, _bookId: string) {
    return this.bookLikeRepository.findOne({
      where: { viewer: { id: _userId }, book: { id: _bookId } },
    });
  }

  findManyBookLikeByUserId(_userId: string) {
    return this.bookLikeRepository.find({
      where: { viewer: { id: _userId } },
    });
  }

  findManyBookLikeByBookId(_bookId: string) {
    return this.bookLikeRepository.find({
      where: { book: { id: _bookId } },
    });
  }
}
