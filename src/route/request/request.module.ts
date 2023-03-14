import { Global, Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { JwtAuthService } from 'src/common/jwt-auth/jwt-auth.service';

@Global()
@Module({
  controllers: [RequestController],
  providers: [JwtAuthService, RequestService],
})
export class RequestModule {}
