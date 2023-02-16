import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { JwtAuthService } from 'src/common/jwt-auth/jwt-auth.service';

@Module({
  controllers: [UserController],
  providers: [JwtAuthService],
})
export class UserModule {}
