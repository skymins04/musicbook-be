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
    _userId: string,
    _bookId: string,
    _sourceId: number,
    _music: DeepPartial<MusicEntity>,
  ) {
    const music = new MusicEntity();
    for (const key of Object.keys(_music)) music[key] = _music[key];
    music.broadcaster.id = _userId;
    music.book.id = _bookId;
    music.musicSourceMelon.songId = _sourceId;
    try {
      return music.save();
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async createMusicByOriginalSource(
    _userId: string,
    _bookId: string,
    _sourceId: string,
    _music: DeepPartial<MusicEntity>,
  ) {
    const music = new MusicEntity();
    for (const key of Object.keys(_music)) music[key] = _music[key];
    music.broadcaster.id = _userId;
    music.book.id = _bookId;
    music.musicSourceOriginal.songId = _sourceId;
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
    await this.musicRepository.softDelete(_musicId);
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
      skip: (_perPage - 1) * _page,
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
      .orderBy('RAND()')
      .skip((_perPage - 1) * _page)
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
      .leftJoinAndSelect('music.musicLikes', 'likes')
      .addSelect('COUNT(likes.id)', 'likeCount')
      .orderBy('likeCount', 'DESC')
      .groupBy('music.id')
      .getMany();
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

  async deleteBookById(_bookId: string) {
    await this.bookRepository.softDelete(_bookId);
    await this.musicRepository.softDelete({ book: { id: _bookId } });
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

  findManyNewestBook(_perPage = 30, _page = 1) {
    return this.bookRepository.find({
      skip: (_perPage - 1) * _page,
      take: _perPage,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findManySuggestBook(_perPage = 30, _page = 1) {
    return this.musicRepository
      .createQueryBuilder('book')
      .orderBy('RAND()')
      .skip((_perPage - 1) * _page)
      .take(_perPage)
      .getMany();
  }

  findManyPopularBook(_perPage = 30, _page = 1) {
    return this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.bookLikes', 'likes')
      .addSelect('COUNT(likes.id)', 'likeCount')
      .orderBy('likeCount', 'DESC')
      .groupBy('book.id')
      .getMany();
  }
}
