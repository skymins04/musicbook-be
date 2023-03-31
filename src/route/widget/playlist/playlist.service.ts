import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudflareR2Service } from 'src/common/cloudflare/cloudflare-r2.service';
import { MusicBookRepository } from 'src/common/repository/musicbook/musicbook.repository';
import { WidgetPlaylistEntity } from 'src/common/repository/widget-playlist/widget-playlist.entity';
import { WidgetPlaylistRepository } from 'src/common/repository/widget-playlist/widget-playlist.repository';

@Injectable()
export class PlaylistService {
  constructor(
    private readonly widgetPlaylistRepository: WidgetPlaylistRepository,
    private readonly musicbookRepository: MusicBookRepository,
    private readonly cloudflareR2Service: CloudflareR2Service,
  ) {}

  async getManyMyWidgetPlaylist(
    _jwt: MusicbookJwtPayload,
  ): Promise<WidgetPlaylistEntity[]> {
    const book = await this.musicbookRepository.findOneBookByUserId(_jwt.id);
    if (!book) throw new BadRequestException('not found book');

    return this.widgetPlaylistRepository.findManyWidgetPlaylistByBookId(
      book.id,
    );
  }

  async createWidgetPlaylist(_jwt: MusicbookJwtPayload) {
    const book = await this.musicbookRepository.findOneBookByUserId(_jwt.id);
    if (!book) throw new BadRequestException('not found book');

    const widget = await this.widgetPlaylistRepository.createWidgetPlaylist(
      _jwt.id,
    );
    await this.cloudflareR2Service.putObject(
      Buffer.from(''),
      'text/css',
      `widget_theme:playlist:${widget.id}`,
    );
    return widget;
  }

  async updateWidgetPlaylist() {}

  async deleteWidgetPlaylist(_jwt: MusicbookJwtPayload, _widgetId: string) {
    const widgetCount =
      await this.widgetPlaylistRepository.getCountWidgetPlaylist(_jwt.id);
    if (widgetCount <= 1)
      throw new BadRequestException('at least one widget must exist');
    const widget =
      await this.widgetPlaylistRepository.findOneWidgetPlaylistByWidgetIdAndUserId(
        _widgetId,
        _jwt.id,
      );
    if (!widget) throw new BadRequestException('not found widget');

    await widget.softRemove();
  }

  async getOneWidgetPlaylist(_widgetId: string) {
    const widget = await this.widgetPlaylistRepository.findOneWidgetPlaylist(
      _widgetId,
      { withJoin: ['book', 'user'] },
    );
    if (!widget) throw new BadRequestException('not found widget');

    return widget;
  }
}
