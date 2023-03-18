import { Global, Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { JwtAuthService } from 'src/common/jwt-auth/jwt-auth.service';

@Global()
@Module({
  controllers: [BookController],
  providers: [BookService, JwtAuthService],
})
export class BookModule {}
