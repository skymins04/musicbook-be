import { BadRequestException, Injectable } from '@nestjs/common';
import { BookEntity } from 'src/common/repository/musicbook/book.entity';
import { MusicBookRepository } from 'src/common/repository/musicbook/musicbook.repository';
import { DeepPartial } from 'typeorm';

@Injectable()
export class BookService {
  constructor(private readonly musicbookRepository: MusicBookRepository) {}

  getBooks() {}

  createBook(_jwt: MusicbookJwtPayload, _book: DeepPartial<BookEntity>) {
    return this.musicbookRepository.createBook(_jwt.id, _book);
  }

  getMyBook() {}
  updateMyBook() {}
  deleteMyBook() {}
  getBook() {}
  getLikeCountOfMusic() {}
  createLikeOfMusic() {}
  deleteLikeOfMusic() {}
  getLikeOfMusic() {}
}
