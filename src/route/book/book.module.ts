import { Global, Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { MusicBookRepository } from 'src/common/repository/musicbook/musicbook.repository';
import { JwtAuthService } from 'src/common/jwt-auth/jwt-auth.service';

@Global()
@Module({
  controllers: [BookController],
  providers: [BookService, MusicBookRepository, JwtAuthService],
})
export class BookModule {}
