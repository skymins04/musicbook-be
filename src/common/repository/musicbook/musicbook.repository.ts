import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { MusicEntity } from './music.entity';
import { BookEntity } from './book.entity';

@Injectable()
export class MusicBookRepository {
  constructor(
    @InjectRepository(MusicEntity)
    private readonly musicRepository: Repository<MusicEntity>,
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) {}

  async createMusicByMelonSource(
    _music: DeepPartial<MusicEntity> & {
      broadcater: { id: string };
      book: { id: string };
      musicSourceMelon: { songId: number };
    },
  ) {
    const music = new MusicEntity();
    for (const key of Object.keys(_music)) music[key] = _music[key];
    try {
      return music.save();
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async createMusicByOriginalSource(
    _music: DeepPartial<MusicEntity> & {
      broadcater: { id: string };
      book: { id: string };
      musicSourceOriginal: { songId: string };
    },
  ) {
    const music = new MusicEntity();
    for (const key of Object.keys(_music)) music[key] = _music[key];
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

  async deleteMusicById(_musicId: string) {
    await this.musicRepository.delete(_musicId);
  }

  async deleteMusicByUserId(_userId: string) {
    await this.musicRepository.delete({ broadcaster: { id: _userId } });
  }

  findOneMusicById(
    _musicId: string,
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

  existMusicById(
    _musicId: string,
    _options?: {
      withDeleted?: boolean;
    },
  ) {
    return this.musicRepository.exist({
      where: { id: _musicId },
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

  existMusicByUserId(
    _userId: string,
    _options?: {
      withDeleted?: boolean;
    },
  ) {
    return this.musicRepository.exist({
      where: { broadcaster: { id: _userId } },
      withDeleted: _options?.withDeleted,
    });
  }

  findManyMusicByBookId(
    _bookId: string,
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
    _sourceId: number,
    _options?: {
      withDeleted?: boolean;
      withJoin?: boolean | ('broadcaster' | 'book')[];
    },
  ) {
    return this.musicRepository.find({
      where: { musicSourceMelon: { songId: _sourceId } },
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

  findManyNewestMusic(_perPage = 30, _page = 1) {
    return this.musicRepository.find({
      where: { isHide: false },
      skip: _perPage * (_page - 1),
      take: _perPage,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findManySuggestMusic(_perPage = 30, _page = 1, _category?: string) {
    let musicQueryBuilder = this.musicRepository.createQueryBuilder('music');
    if (_category) {
      if (_category.match(/[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z|A-Z|0-9|-|_| ]/))
        throw new BadRequestException();
      musicQueryBuilder = musicQueryBuilder.where(
        'music.category = :category',
        {
          category: _category,
        },
      );
    }
    return musicQueryBuilder
      .where('music.is_hide = 0')
      .orderBy('RAND()')
      .skip(_perPage * (_page - 1))
      .take(_perPage)
      .getMany();
  }

  findManyPopularMusic(_perPage = 30, _page = 1, _category?: string) {
    let musicQueryBuilder = this.musicRepository.createQueryBuilder('music');
    if (_category) {
      if (_category.match(/[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z|A-Z|0-9|-|_| ]/))
        throw new BadRequestException();
      musicQueryBuilder = musicQueryBuilder.where(
        'music.category = :category',
        {
          category: _category,
        },
      );
    }
    return musicQueryBuilder
      .where('music.is_hide = 0')
      .leftJoinAndSelect('music.musicLikes', 'likes')
      .addSelect('COUNT(likes.id)', 'likeCount')
      .orderBy('likeCount', 'DESC')
      .groupBy('music.id')
      .skip(_perPage * (_page - 1))
      .take(_perPage)
      .getMany();
  }

  async createBook(
    _book: DeepPartial<BookEntity> & { broadcaster: { id: string } },
  ) {
    const book = new BookEntity();
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

  async deleteBookById(_bookId: string) {
    await this.bookRepository.delete(_bookId);
    await this.musicRepository.delete({ book: { id: _bookId } });
  }

  async deleteBookByUserId(_userId: string) {
    await this.bookRepository.delete({ broadcaster: { id: _userId } });
    await this.musicRepository.delete({ broadcaster: { id: _userId } });
  }

  findOneBookById(
    _bookId: string,
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

  existBookById(
    _bookId: string,
    _options?: {
      withDeleted?: boolean;
    },
  ) {
    return this.bookRepository.exist({
      where: { id: _bookId },
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

  existBookByUserId(
    _userId: string,
    _options?: {
      withDeleted?: boolean;
    },
  ) {
    return this.bookRepository.exist({
      where: { broadcaster: { id: _userId } },
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

  existBookByCustomId(
    _customId: string,
    _options?: {
      withDeleted?: boolean;
    },
  ) {
    return this.bookRepository.exist({
      where: { customId: _customId },
      withDeleted: _options?.withDeleted,
    });
  }

  findManyNewestBook(_perPage = 30, _page = 1) {
    return this.bookRepository.find({
      where: { isHide: false },
      skip: _perPage * (_page - 1),
      take: _perPage,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findManySuggestBook(_perPage = 30, _page = 1) {
    return this.bookRepository
      .createQueryBuilder('book')
      .where('book.is_hide = 0')
      .orderBy('RAND()')
      .skip(_perPage * (_page - 1))
      .take(_perPage)
      .getMany();
  }

  findManyPopularBook(_perPage = 30, _page = 1) {
    return this.bookRepository
      .createQueryBuilder('book')
      .where('book.is_hide = 0')
      .leftJoinAndSelect('book.bookLikes', 'likes')
      .addSelect('COUNT(likes.id)', 'likeCount')
      .orderBy('likeCount', 'DESC')
      .groupBy('book.id')
      .skip(_perPage * (_page - 1))
      .take(_perPage)
      .getMany();
  }
}
