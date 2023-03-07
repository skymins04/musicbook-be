import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MusicLikeEntity } from './music-like.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { BookLikeEntity } from './book-like.entity';
import { MusicBookRepository } from './musicbook.repository';

@Injectable()
export class MusicBookLikeRepository {
  constructor(
    @InjectRepository(MusicLikeEntity)
    private readonly musicLikeRepository: Repository<MusicLikeEntity>,
    @InjectRepository(BookLikeEntity)
    private readonly bookLikeRepository: Repository<BookLikeEntity>,
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
    like.viewer = { id: _userId } as any;
    like.book = music.book;
    like.music = music;
    music.likeCount += 1;
    await this.musicLikeRepository.save(like);
    await music.save();
  }

  async deleteMusicLike(_userId: string, _musicId: string) {
    const res = await this.musicLikeRepository.delete({
      viewer: { id: _userId },
      music: { id: _musicId },
    });
    if (!res.affected) throw new BadRequestException();
    const music = await this.musicbookRepository.findOneMusicById(_musicId, {
      withJoin: false,
    });
    if (!music) throw new BadRequestException();
    music.likeCount -= 1;
    await music.save();
  }

  findOneMusicLike(_userId: string, _musicId: string) {
    return this.musicLikeRepository.findOne({
      where: { viewer: { id: _userId }, music: { id: _musicId } },
    });
  }

  existMusicLike(_userId: string, _musicId: string) {
    return this.musicLikeRepository.exist({
      where: { viewer: { id: _userId }, music: { id: _musicId } },
    });
  }

  findManyMusicLikeByUserId(_userId: string) {
    return this.musicLikeRepository.find({
      where: { viewer: { id: _userId } },
    });
  }

  getCountMusicLikeByUserId(_userId: string, _date?: Date) {
    return this.musicLikeRepository.count({
      where: {
        viewer: { id: _userId },
        createdAt: _date ? LessThanOrEqual(_date) : undefined,
      },
    });
  }

  findManyMusicLikeByMusicId(_musicId: string) {
    return this.musicLikeRepository.find({
      where: { music: { id: _musicId } },
    });
  }

  getCountMusicLikeByMusicId(_musicId: string, _date?: Date) {
    return this.musicLikeRepository.count({
      where: {
        music: { id: _musicId },
        createdAt: _date ? LessThanOrEqual(_date) : undefined,
      },
    });
  }

  async createBookLike(_userId: string, _bookId: string) {
    const isExistingLike = await this.bookLikeRepository.exist({
      where: { viewer: { id: _userId }, book: { id: _bookId } },
    });
    if (isExistingLike) throw new BadRequestException();
    const book = await this.musicbookRepository.findOneBookById(_bookId, {
      withJoin: false,
    });
    if (!book) throw new BadRequestException();

    const like = new MusicLikeEntity();
    like.viewer = { id: _userId } as any;
    like.book = book;
    book.likeCount += 1;
    await this.bookLikeRepository.save(like);
    await book.save();
  }

  async deleteBookLike(_userId: string, _bookId: string) {
    const res = await this.bookLikeRepository.delete({
      viewer: { id: _userId },
      book: { id: _bookId },
    });
    if (!res.affected) throw new BadRequestException();

    const book = await this.musicbookRepository.findOneBookById(_bookId, {
      withJoin: false,
    });
    if (!book) throw new BadRequestException();
    book.likeCount -= 1;
    await book.save();
  }

  findOneBookLike(_userId: string, _bookId: string) {
    return this.bookLikeRepository.findOne({
      where: { viewer: { id: _userId }, book: { id: _bookId } },
    });
  }

  existBookLike(_userId: string, _bookId: string) {
    return this.bookLikeRepository.exist({
      where: { viewer: { id: _userId }, book: { id: _bookId } },
    });
  }

  findManyBookLikeByUserId(_userId: string) {
    return this.bookLikeRepository.find({
      where: { viewer: { id: _userId } },
    });
  }

  getCountBookLikeByUserId(_userId: string, _date?: Date) {
    return this.bookLikeRepository.count({
      where: {
        viewer: { id: _userId },
        createdAt: _date ? LessThanOrEqual(_date) : undefined,
      },
    });
  }

  findManyBookLikeByBookId(_bookId: string) {
    return this.bookLikeRepository.find({
      where: { book: { id: _bookId } },
    });
  }

  getCountBookLikeByBookId(_bookId: string, _date?: Date) {
    return this.bookLikeRepository.count({
      where: {
        book: {
          id: _bookId,
          createdAt: _date ? LessThanOrEqual(_date) : undefined,
        },
      },
    });
  }
}
