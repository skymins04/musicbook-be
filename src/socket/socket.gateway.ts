import { InjectRedis } from '@nestjs-modules/ioredis';
import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  // MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  // SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Redis } from 'ioredis';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: /\/ws-.+/ })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger(SocketGateway.name);

  constructor(@InjectRedis() private readonly redisCache: Redis) {}

  afterInit(server: Server) {
    this.logger.debug('WebSocket Server initialized');
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.debug(
      `WebSocket client connected (${socket.nsp.name}, ${socket.id})`,
    );
    socket.emit('hello', `socket server PID - ${process.pid}`);
    const history = await this.redisCache.get(`${socket.nsp.name}_history`);
    if (history) socket.emit('history', history);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.debug(
      `WebSocket client disconnected (${socket.nsp.name}, ${socket.id})`,
    );
  }

  // @SubscribeMessage('chat')
  // async handleMessage(
  //   @ConnectedSocket() socket: Socket,
  //   @MessageBody() msg: string,
  // ) {
  //   this.logger.debug(
  //     `WebSocket client msg (${socket.nsp.name}, ${socket.id}) ${msg}`,
  //   );
  //   const history = await this.redisCache.get(`${socket.nsp.name}_history`);
  //   if (history) {
  //     await this.redisCache.set(
  //       `${socket.nsp.name}_history`,
  //       JSON.stringify([...JSON.parse(history), msg]),
  //     );
  //   } else {
  //     await this.redisCache.set(
  //       `${socket.nsp.name}_history`,
  //       JSON.stringify([msg]),
  //     );
  //   }
  //   await this.redisCache.expire(`${socket.nsp.name}_history`, 10);
  //   socket.nsp.emit('new-msg', msg);
  // }
}
