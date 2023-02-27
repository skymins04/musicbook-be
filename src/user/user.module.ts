import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { JwtAuthService } from 'src/common/jwt-auth/jwt-auth.service';
import { UserService } from './user.service';
import { UserRepositoryService } from 'src/common/repository/user/user-repository.service';

@Module({
  controllers: [UserController],
  providers: [
    JwtAuthService,
    UserService,
    UserRepositoryService,
    JwtAuthService,
  ],
})
export class UserModule {}
