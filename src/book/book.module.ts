import { Global, Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';

@Global()
@Module({
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
