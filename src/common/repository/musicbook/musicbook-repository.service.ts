import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { MusicEntity } from './music.entity';
import { BookEntity } from './book.entity';

@Injectable()
export class MusicBookRepositoryService {
  constructor(
    @InjectRepository(MusicEntity)
    private readonly musicRepository: Repository<MusicEntity>,
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) {}

  async createMusicByMelonSource(
    _userId: string,
    _bookId: number,
    _songId: number,
    _music: DeepPartial<MusicEntity>,
  ) {
    const music = new MusicEntity();
    for (const key of Object.keys(_music)) music[key] = _music[key];
    music.broadcaster.id = _userId;
    music.book.id = _bookId;
    music.musicSourceMelon.songId = _songId;
    try {
      return music.save();
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async createMusicByOriginalSource(
    _userId: string,
    _bookId: number,
    _songId: string,
    _music: DeepPartial<MusicEntity>,
  ) {
    const music = new MusicEntity();
    for (const key of Object.keys(_music)) music[key] = _music[key];
    music.broadcaster.id = _userId;
    music.book.id = _bookId;
    music.musicSourceOriginal.songId = _songId;
    try {
      return music.save();
    } catch (e) {
      throw new BadRequestException();
    }
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

  async deleteMusicById(_musicId: number) {
    await this.musicRepository.softDelete(_musicId);
  }

  findOneMusicById(
    _musicId: number,
    _options?: {
      withDeleted?: boolean;
      withJoin?: boolean | ('broadcaster' | 'book')[];
    },
  ) {
    return this.musicRepository.findOne({
      where: { id: _musicId },
      relations:
        _options?.withJoin === undefined || _options?.withJoin
          ? typeof _options?.withJoin === 'boolean' ||
            _options?.withJoin === undefined
            ? ['broadcaster', 'book']
            : _options?.withJoin
          : [],
      withDeleted: _options?.withDeleted,
    });
  }

  findOneMusicByUserId(
    _userId: string,
    _options?: {
      withDeleted?: boolean;
      withJoin?: boolean | ('broadcaster' | 'book')[];
    },
  ) {
    return this.musicRepository.findOne({
      where: { broadcaster: { id: _userId } },
      relations:
        _options?.withJoin === undefined || _options?.withJoin
          ? typeof _options?.withJoin === 'boolean' ||
            _options?.withJoin === undefined
            ? ['broadcaster', 'book']
            : _options?.withJoin
          : [],
      withDeleted: _options?.withDeleted,
    });
  }

  findManyMusicByBookId(
    _bookId: number,
    _options?: {
      withDeleted?: boolean;
      withJoin?: boolean | ('broadcaster' | 'book')[];
    },
  ) {
    return this.musicRepository.find({
      where: { book: { id: _bookId } },
      relations:
        _options?.withJoin === undefined || _options?.withJoin
          ? typeof _options?.withJoin === 'boolean' ||
            _options?.withJoin === undefined
            ? ['broadcaster', 'book']
            : _options?.withJoin
          : [],
      withDeleted: _options?.withDeleted,
    });
  }

  findManyMusicByMelonId(
    _songId: number,
    _options?: {
      withDeleted?: boolean;
      withJoin?: boolean | ('broadcaster' | 'book')[];
    },
  ) {
    return this.musicRepository.find({
      where: { musicSourceMelon: { songId: _songId } },
      relations:
        _options?.withJoin === undefined || _options?.withJoin
          ? typeof _options?.withJoin === 'boolean' ||
            _options?.withJoin === undefined
            ? ['broadcaster', 'book']
            : _options?.withJoin
          : [],
      withDeleted: _options?.withDeleted,
    });
  }

  async createBook(_userId: string, _book: DeepPartial<BookEntity>) {
    if (this.bookRepository.exist({ where: { broadcaster: { id: _userId } } }))
      throw new BadRequestException('already created');
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

  async deleteBookById(_bookId: number) {
    await this.bookRepository.softDelete(_bookId);
    await this.musicRepository.softDelete({ book: { id: _bookId } });
  }

  findOneBookById(
    _bookId: number,
    _options?: {
      withDeleted?: boolean;
      withJoin?: boolean | ('broadcaster' | 'musics')[];
    },
  ) {
    return this.bookRepository.findOne({
      where: { id: _bookId },
      relations:
        _options?.withJoin === undefined || _options?.withJoin
          ? typeof _options?.withJoin === 'boolean' ||
            _options?.withJoin === undefined
            ? ['broadcaster']
            : _options?.withJoin
          : [],
      withDeleted: _options?.withDeleted,
    });
  }

  findOneBookByUserId(
    _userId: string,
    _options?: {
      withDeleted?: boolean;
      withJoin?: boolean | ('broadcaster' | 'musics')[];
    },
  ) {
    return this.bookRepository.findOne({
      where: { broadcaster: { id: _userId } },
      relations:
        _options?.withJoin === undefined || _options?.withJoin
          ? typeof _options?.withJoin === 'boolean' ||
            _options?.withJoin === undefined
            ? ['broadcaster']
            : _options?.withJoin
          : [],
      withDeleted: _options?.withDeleted,
    });
  }

  findManyBookByCustomBookId(
    _customBookId: string,
    _options?: {
      withDeleted?: boolean;
      withJoin?: boolean | ('broadcaster' | 'musics')[];
    },
  ) {
    return this.musicRepository.find({
      where: { book: { customId: _customBookId } },
      relations:
        _options?.withJoin === undefined || _options?.withJoin
          ? typeof _options?.withJoin === 'boolean' ||
            _options?.withJoin === undefined
            ? ['broadcaster']
            : _options?.withJoin
          : [],
      withDeleted: _options?.withDeleted,
    });
  }
}