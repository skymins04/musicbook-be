import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { MusicEntity } from './music.entity';
import { MusicLikeEntity } from './music-like.entity';
import { MusicLikeCountEntity } from './music-like-count.entity';
import { BookEntity } from './book.entity';
import { BookLikeEntity } from './book-like.entity';
import { BookLikeCountEntity } from './book-like-count.entity';

@Injectable()
export class MusicBookRepositoryService {
  constructor(
    @InjectRepository(MusicEntity)
    private readonly musicRepository: Repository<MusicEntity>,
    @InjectRepository(MusicLikeEntity)
    private readonly musicLikeRepository: Repository<MusicLikeEntity>,
    @InjectRepository(MusicLikeCountEntity)
    private readonly musicLikeCountRepository: Repository<MusicLikeCountEntity>,
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    @InjectRepository(BookLikeEntity)
    private readonly bookLikeRepository: Repository<BookLikeEntity>,
    @InjectRepository(BookLikeCountEntity)
    private readonly bookLikeCountRepository: Repository<BookLikeCountEntity>,
  ) {}

  async createMusic(
    _userId: string,
    _bookId: number,
    _music: DeepPartial<MusicEntity>,
  ) {
    if (_music.melonId && !_music.melonId.match(/^melon_song_[0-9]+$/))
      throw new BadRequestException('invaild melon song id');

    const music = new MusicEntity();
    music.broadcaster.id = _userId;
    music.book.id = _bookId;
    for (const key of Object.keys(_music)) music[key] = _music[key];
    return music.save();
  }

  async updateMusic(
    _where:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | FindOptionsWhere<MusicEntity>,
    _music: DeepPartial<MusicEntity>,
  ) {
    await this.musicRepository.update(_music.id, _music);
  }

  findOneMusicById(
    _musicId: number,
    _option?: {
      withDeleted?: boolean;
      withJoin?: boolean | ('broadcaster' | 'book')[];
    },
  ) {
    return this.musicRepository.findOne({
      where: { id: _musicId },
      relations:
        _option?.withJoin === undefined || _option?.withJoin
          ? typeof _option?.withJoin === 'boolean' ||
            _option?.withJoin === undefined
            ? ['broadcaster', 'book']
            : _option?.withJoin
          : [],
      withDeleted: _option?.withDeleted,
    });
  }

  findOneMusicByUserId(
    _userId: string,
    _option?: {
      withDeleted?: boolean;
      withJoin?: boolean | ('broadcaster' | 'book')[];
    },
  ) {
    return this.musicRepository.findOne({
      where: { broadcaster: { id: _userId } },
      relations:
        _option?.withJoin === undefined || _option?.withJoin
          ? typeof _option?.withJoin === 'boolean' ||
            _option?.withJoin === undefined
            ? ['broadcaster', 'book']
            : _option?.withJoin
          : [],
      withDeleted: _option?.withDeleted,
    });
  }

  findManyMusicByBookId(
    _bookId: number,
    _option?: {
      withDeleted?: boolean;
      withJoin?: boolean | ('broadcaster' | 'book')[];
    },
  ) {
    return this.musicRepository.find({
      where: { book: { id: _bookId } },
      relations:
        _option?.withJoin === undefined || _option?.withJoin
          ? typeof _option?.withJoin === 'boolean' ||
            _option?.withJoin === undefined
            ? ['broadcaster', 'book']
            : _option?.withJoin
          : [],
      withDeleted: _option?.withDeleted,
    });
  }

  findManyMusicByMelonId(
    _melonId: string,
    _option?: {
      withDeleted?: boolean;
      withJoin?: boolean | ('broadcaster' | 'book')[];
    },
  ) {
    return this.musicRepository.find({
      where: { melonId: _melonId },
      relations:
        _option?.withJoin === undefined || _option?.withJoin
          ? typeof _option?.withJoin === 'boolean' ||
            _option?.withJoin === undefined
            ? ['broadcaster', 'book']
            : _option?.withJoin
          : [],
      withDeleted: _option?.withDeleted,
    });
  }

  async createBook(_userId: string, _book: DeepPartial<BookEntity>) {
    const book = new BookEntity();
    book.broadcaster.id = _userId;
    for (const key of Object.keys(_book)) book[key] = _book[key];
    return book.save();
  }

  async updateBook(
    _where:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | FindOptionsWhere<BookEntity>,
    _book: DeepPartial<BookEntity>,
  ) {
    await this.bookRepository.update(_where, _book);
  }

  findOneBookById(
    _bookId: number,
    _option?: {
      withDeleted?: boolean;
      withJoin?: boolean | ('broadcaster' | 'musics')[];
    },
  ) {
    return this.bookRepository.findOne({
      where: { id: _bookId },
      relations:
        _option?.withJoin === undefined || _option?.withJoin
          ? typeof _option?.withJoin === 'boolean' ||
            _option?.withJoin === undefined
            ? ['broadcaster']
            : _option?.withJoin
          : [],
      withDeleted: _option?.withDeleted,
    });
  }

  findOneBookByUserId(
    _userId: string,
    _option?: {
      withDeleted?: boolean;
      withJoin?: boolean | ('broadcaster' | 'musics')[];
    },
  ) {
    return this.bookRepository.findOne({
      where: { broadcaster: { id: _userId } },
      relations:
        _option?.withJoin === undefined || _option?.withJoin
          ? typeof _option?.withJoin === 'boolean' ||
            _option?.withJoin === undefined
            ? ['broadcaster']
            : _option?.withJoin
          : [],
      withDeleted: _option?.withDeleted,
    });
  }

  findManyBookByCustomBookId(
    _customBookId: string,
    _option?: {
      withDeleted?: boolean;
      withJoin?: boolean | ('broadcaster' | 'musics')[];
    },
  ) {
    return this.musicRepository.find({
      where: { book: { customId: _customBookId } },
      relations:
        _option?.withJoin === undefined || _option?.withJoin
          ? typeof _option?.withJoin === 'boolean' ||
            _option?.withJoin === undefined
            ? ['broadcaster']
            : _option?.withJoin
          : [],
      withDeleted: _option?.withDeleted,
    });
  }
}
