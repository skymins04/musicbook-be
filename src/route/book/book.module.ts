import { Global, Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { MusicBookRepository } from 'src/common/repository/musicbook/musicbook.repository';

@Global()
@Module({
  controllers: [BookController],
  providers: [BookService, MusicBookRepository],
})
export class BookModule {}
