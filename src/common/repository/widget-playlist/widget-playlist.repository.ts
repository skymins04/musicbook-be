import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { WidgetPlaylistEntity } from './widget-playlist.entity';
import { MusicBookRepository } from '../musicbook/musicbook.repository';

@Injectable()
export class WidgetPlaylistRepository {
  constructor(
    @InjectRepository(WidgetPlaylistEntity)
    private readonly widgetPlaylistRepository: Repository<WidgetPlaylistEntity>,
    private readonly musicbookRepository: MusicBookRepository,
  ) {}

  async createWidgetPlaylist(_userId: string): Promise<WidgetPlaylistEntity> {
    const book = await this.musicbookRepository.findOneBookByUserId(_userId, {
      withJoin: ['broadcaster'],
    });
    if (!book) throw new BadRequestException('not found book');

    return this.widgetPlaylistRepository.save(
      new WidgetPlaylistEntity({ book, user: book.broadcaster }),
    );
  }

  async updateWidgetPlaylist(
    _userId: string,
    _widgetId: string,
    _widget: DeepPartial<WidgetPlaylistEntity>,
  ) {
    const result = await this.widgetPlaylistRepository.update(
      { id: _widgetId, user: { id: _userId } },
      _widget,
    );
    if (!result.affected)
      throw new BadRequestException('failed update widget playlist');
  }

  findOneWidgetPlaylist(
    _widgetId: string,
    _options?: {
      withDeleted?: boolean;
      withJoin?: boolean | ('user' | 'book')[];
    },
  ) {
    return this.widgetPlaylistRepository.findOne({
      where: { id: _widgetId },
      relations:
        _options?.withJoin === undefined || _options?.withJoin
          ? typeof _options?.withJoin === 'boolean' ||
            _options?.withJoin === undefined
            ? ['book']
            : _options?.withJoin
          : [],
      withDeleted: _options?.withDeleted,
    });
  }

  findOneWidgetPlaylistByWidgetIdAndUserId(
    _widgetId: string,
    _userId: string,
    _options?: {
      withDeleted?: boolean;
      withJoin?: boolean | ('user' | 'book')[];
    },
  ) {
    return this.widgetPlaylistRepository.findOne({
      where: { id: _widgetId, user: { id: _userId } },
      relations:
        _options?.withJoin === undefined || _options?.withJoin
          ? typeof _options?.withJoin === 'boolean' ||
            _options?.withJoin === undefined
            ? ['book']
            : _options?.withJoin
          : [],
      withDeleted: _options?.withDeleted,
    });
  }

  existWidgetPlaylist(
    _widgetId: string,
    _options?: {
      withDeleted?: boolean;
    },
  ) {
    return this.widgetPlaylistRepository.exist({
      where: { id: _widgetId },
      withDeleted: _options?.withDeleted,
    });
  }

  findManyWidgetPlaylistByUserId(
    _userId: string,
    _options?: {
      withDeleted?: boolean;
      withJoin?: boolean | ('user' | 'book')[];
    },
  ) {
    return this.widgetPlaylistRepository.find({
      where: { user: { id: _userId } },
      relations:
        _options?.withJoin === undefined || _options?.withJoin
          ? typeof _options?.withJoin === 'boolean' ||
            _options?.withJoin === undefined
            ? ['book']
            : _options?.withJoin
          : [],
      withDeleted: _options?.withDeleted,
    });
  }

  findManyWidgetPlaylistByBookId(
    _bookId: string,
    _options?: {
      withDeleted?: boolean;
      withJoin?: boolean | ('user' | 'book')[];
    },
  ) {
    return this.widgetPlaylistRepository.find({
      where: { book: { id: _bookId } },
      relations:
        _options?.withJoin === undefined || _options?.withJoin
          ? typeof _options?.withJoin === 'boolean' ||
            _options?.withJoin === undefined
            ? ['book']
            : _options?.withJoin
          : [],
      withDeleted: _options?.withDeleted,
    });
  }

  getCountWidgetPlaylist(_userId: string) {
    return this.widgetPlaylistRepository.count({
      where: { user: { id: _userId } },
    });
  }

  async deleteOneWidgetPlaylist(_widgetId: string) {
    const result = await this.widgetPlaylistRepository.softDelete(_widgetId);
    if (!result.affected)
      throw new BadRequestException('failed delete widget playlist');
  }

  async deleteManyWidgetPlaylistByUserId(_userId: string) {
    const result = await this.widgetPlaylistRepository.softDelete({
      user: { id: _userId },
    });
    if (!result.affected)
      throw new BadRequestException('failed delete widget playlist');
  }

  async deleteManyWidgetPlaylistByBookId(_bookId: string) {
    const result = await this.widgetPlaylistRepository.softDelete({
      book: { id: _bookId },
    });
    if (!result.affected)
      throw new BadRequestException('failed delete widget playlist');
  }
}
