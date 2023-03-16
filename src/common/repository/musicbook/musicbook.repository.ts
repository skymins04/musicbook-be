import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { MusicEntity } from './music.entity';
import { BookEntity } from './book.entity';
import { MusicBookSourceRepository } from './musicbook-source.repository';

@Injectable()
export class MusicBookRepository {
  constructor(
    @InjectRepository(MusicEntity)
    private readonly musicRepository: Repository<MusicEntity>,
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    private readonly musicbookSourceRepository: MusicBookSourceRepository,
  ) {}

  async createMusicByMelonSource(
    _music: DeepPartial<MusicEntity> & {
      broadcaster: { id: string };
      book: { id: string };
      musicSourceMelon: { songId: number };
    },
  ) {
    const source = await this.musicbookSourceRepository.findOneSourceMelonById(
      _music.musicSourceMelon.songId,
    );
    if (!source) throw new BadRequestException();

    const music = new MusicEntity(_music);
    if (!_music.title) music.title = source.songTitle;
    music.category = source.category;

    try {
      return music.save();
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async createMusicByOriginalSource(
    _music: DeepPartial<MusicEntity> & {
      broadcaster: { id: string };
      book: { id: string };
      musicSourceOriginal: { songId: string };
    },
  ) {
    const source =
      await this.musicbookSourceRepository.findOneSourceOrigialById(
        _music.musicSourceOriginal.songId,
      );
    if (!source) throw new BadRequestException();

    const music = new MusicEntity(_music);
    if (!_music.title) music.title = source.songTitle;
    music.category = source.category;

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
    const result = await this.musicRepository.update(_where, _music);
    if (!result.affected) throw new BadRequestException();
  }

  async deleteMusic(_userId: string, _musicId: string) {
    const result = await this.musicRepository.softDelete({
      id: _musicId,
      broadcaster: { id: _userId },
    });
    if (!result.affected) throw new BadRequestException();
  }

  async deleteMusicById(_musicId: string) {
    const result = await this.musicRepository.softDelete(_musicId);
    if (!result.affected) throw new BadRequestException();
  }

  async deleteMusicByUserId(_userId: string) {
    const result = await this.musicRepository.softDelete({
      broadcaster: { id: _userId },
    });
    if (!result.affected) throw new BadRequestException();
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
    _musicId: string,
    _options?: {
      withDeleted?: boolean;
      withJoin?: boolean | ('broadcaster' | 'book')[];
    },
  ) {
    return this.musicRepository.findOne({
      where: { id: _musicId, broadcaster: { id: _userId } },
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

  findManyMusicByUserId(
    _userId: string,
    _options?: {
      withDeleted?: boolean;
    },
  ) {
    return this.musicRepository.find({
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

  findManyNewestMusic(
    _perPage = 30,
    _page = 1,
    _options?: { category?: string; bookId?: string; userId?: string },
  ) {
    return this.musicRepository.find({
      where: {
        isHide: false,
        category: _options?.category,
        book: { id: _options?.bookId },
        broadcaster: { id: _options?.userId },
      },
      skip: _perPage * (_page - 1),
      take: _perPage,
      order: {
        createdAt: 'DESC',
      },
      relations: [
        'broadcaster',
        'book',
        'musicSourceOriginal',
        'musicSourceMelon',
      ],
    });
  }

  findManySuggestMusic(
    _perPage = 30,
    _page = 1,
    _options?: { category?: string; bookId?: string; userId?: string },
  ) {
    let musicQueryBuilder = this.musicRepository
      .createQueryBuilder('music')
      .where('music.is_hide = 0');

    if (_options?.category)
      musicQueryBuilder = musicQueryBuilder.andWhere(
        'music.category = :category',
        {
          category: _options.category,
        },
      );
    if (_options?.bookId)
      musicQueryBuilder = musicQueryBuilder.andWhere('book.id = :id', {
        id: _options.bookId,
      });
    if (_options?.userId)
      musicQueryBuilder = musicQueryBuilder.andWhere('broadcaster.id = :id', {
        id: _options.userId,
      });

    return musicQueryBuilder
      .leftJoinAndSelect('music.broadcaster', 'broadcaster')
      .leftJoinAndSelect('music.book', 'book')
      .leftJoinAndSelect('music.musicSourceOriginal', 'musicSourceOriginal')
      .leftJoinAndSelect('music.musicSourceMelon', 'musicSourceMelon')
      .orderBy('RAND()')
      .skip(_perPage * (_page - 1))
      .take(_perPage)
      .getMany();
  }

  findManyPopularMusic(
    _perPage = 30,
    _page = 1,
    _options?: { category?: string; bookId?: string; userId?: string },
  ) {
    let musicQueryBuilder = this.musicRepository
      .createQueryBuilder('music')
      .where('music.is_hide = 0');

    if (_options?.category)
      musicQueryBuilder = musicQueryBuilder.andWhere(
        'music.category = :category',
        {
          category: _options.category,
        },
      );
    if (_options?.bookId)
      musicQueryBuilder = musicQueryBuilder.andWhere('book.id = :id', {
        id: _options.bookId,
      });
    if (_options?.userId)
      musicQueryBuilder = musicQueryBuilder.andWhere('broadcaster.id = :id', {
        id: _options.userId,
      });

    return musicQueryBuilder
      .leftJoinAndSelect('music.broadcaster', 'broadcaster')
      .leftJoinAndSelect('music.book', 'book')
      .leftJoinAndSelect('music.musicSourceOriginal', 'musicSourceOriginal')
      .leftJoinAndSelect('music.musicSourceMelon', 'musicSourceMelon')
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
    const book = new BookEntity(_book);
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
    const result = await this.bookRepository.update(_where, _book);
    if (!result.affected) throw new BadRequestException();
  }

  async deleteBookById(_bookId: string) {
    await this.bookRepository.softDelete(_bookId);
    await this.musicRepository.softDelete({ book: { id: _bookId } });
  }

  async deleteBookByUserId(_userId: string) {
    await this.bookRepository.softDelete({ broadcaster: { id: _userId } });
    await this.musicRepository.softDelete({ broadcaster: { id: _userId } });
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

  findOneBookByCustomBookId(
    _customBookId: string,
    _options?: {
      withDeleted?: boolean;
      withJoin?: boolean | ('broadcaster' | 'musics')[];
    },
  ) {
    return this.bookRepository.findOne({
      where: { customId: _customBookId },
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
