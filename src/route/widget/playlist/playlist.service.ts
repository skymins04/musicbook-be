import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudflareR2Service } from 'src/common/cloudflare/cloudflare-r2.service';
import { MusicBookRepository } from 'src/common/repository/musicbook/musicbook.repository';
import { WidgetPlaylistEntity } from 'src/common/repository/widget-playlist/widget-playlist.entity';
import { WidgetPlaylistRepository } from 'src/common/repository/widget-playlist/widget-playlist.repository';
import { PlaylistUpdateDTO } from './dto/playlist.dto';
import { PlaylistGateway } from './playlist.gateway';

@Injectable()
export class PlaylistService {
  constructor(
    private readonly widgetPlaylistRepository: WidgetPlaylistRepository,
    private readonly musicbookRepository: MusicBookRepository,
    private readonly cloudflareR2Service: CloudflareR2Service,
    private readonly widgetPlaylistGateway: PlaylistGateway,
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

  async updateWidgetPlaylist(
    _jwt: MusicbookJwtPayload,
    _widgetId: string,
    _widget: PlaylistUpdateDTO,
  ) {
    const widget =
      await this.widgetPlaylistRepository.findOneWidgetPlaylistByWidgetIdAndUserId(
        _widgetId,
        _jwt.id,
      );
    if (!widget) throw new BadRequestException();

    if (_widget.theme === 'CUSTOM')
      await this.cloudflareR2Service.putObject(
        Buffer.from(_widget.customCSS),
        'text/css',
        `widget_theme:playlist:${widget.id}`,
      );

    await this.widgetPlaylistRepository
      .updateWidgetPlaylist(_jwt.id, _widgetId, {
        title: _widget.title,
        theme: _widget.theme,
        fontSize: _widget.fontSize,
      })
      .then(() => {
        this.widgetPlaylistGateway.sendRefreshEventByWidgetId(_widgetId);
      });
  }

  async deleteWidgetPlaylist(_jwt: MusicbookJwtPayload, _widgetId: string) {
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
