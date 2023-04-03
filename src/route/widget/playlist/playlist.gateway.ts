import { Injectable, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WidgetPlaylistRepository } from 'src/common/repository/widget-playlist/widget-playlist.repository';

@Injectable()
@WebSocketGateway({ namespace: /\/ws-widget-playlist-.+/, cors: true })
export class PlaylistGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly widgetPlaylistRepository: WidgetPlaylistRepository,
  ) {}

  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(PlaylistGateway.name);

  afterInit(server: Server) {
    this.logger.log('playlist widget gateway initialized');
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.debug(`connected ${socket.nsp.name}, ${socket.id}`);
    const widgetId = socket.nsp.name.replace('/ws-widget-playlist-', '');
    const result = await this.widgetPlaylistRepository.existWidgetPlaylist(
      widgetId,
    );
    if (!result) socket._error('not found widget');
    else socket.emit('connected', socket.nsp.name);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.debug(`disconnected ${socket.nsp.name}, ${socket.id}`);
  }

  getWebSocketServer(): Server {
    return (this.server as any).server;
  }

  getNamespaceByWidgetId(_widgetId: string) {
    return this.getWebSocketServer().of(`/ws-widget-playlist-${_widgetId}`);
  }

  sendUpdateEventByWidgetId(_widgetId: string) {
    const nsp = this.getNamespaceByWidgetId(_widgetId);
    nsp.emit('update');
  }

  sendRefreshEventByWidgetId(_widgetId: string) {
    const nsp = this.getNamespaceByWidgetId(_widgetId);
    nsp.emit('refresh');
  }
}
