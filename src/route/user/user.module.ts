import { Global, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { JwtAuthService } from 'src/common/jwt-auth/jwt-auth.service';
import { UserService } from './user.service';
import { UserRepository } from 'src/common/repository/user/user.repository';

@Global()
@Module({
  controllers: [UserController],
  providers: [JwtAuthService, UserService, UserRepository],
})
export class UserModule {}
