import { Global, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { JwtAuthService } from 'src/common/jwt-auth/jwt-auth.service';
import { UserService } from './user.service';

@Global()
@Module({
  controllers: [UserController],
  providers: [JwtAuthService, UserService],
})
export class UserModule {}
