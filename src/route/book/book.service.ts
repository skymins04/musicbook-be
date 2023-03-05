import { BadRequestException, Injectable } from '@nestjs/common';
import { BookEntity } from 'src/common/repository/musicbook/book.entity';
import { MusicBookLikeRepository } from 'src/common/repository/musicbook/musicbook-like.repository';
import { MusicBookRepository } from 'src/common/repository/musicbook/musicbook.repository';
import { DeepPartial } from 'typeorm';

@Injectable()
export class BookService {
  constructor(
    private readonly musicbookRepository: MusicBookRepository,
    private readonly musicbookLikeRepository: MusicBookLikeRepository,
  ) {}

  private getBooksSortHandler: Record<
    MusicbookSortMethod,
    (_perPage: number, _page: number) => Promise<BookEntity[]>
  > = {
    newest: (_perPage, _page) => {
      return this.musicbookRepository.findManyNewestBook(_perPage, _page);
    },
    suggest: (_perPage, _page) => {
      return this.musicbookRepository.findManySuggestBook(_perPage, _page);
    },
    popular: (_perPage, _page) => {
      return this.musicbookRepository.findManyPopularBook(_perPage, _page);
    },
  };

  getBooks(_perPage: number, _page: number, _sort: MusicbookSortMethod) {
    return this.getBooksSortHandler[_sort](_perPage, _page);
  }

  createBook(_jwt: MusicbookJwtPayload, _book: DeepPartial<BookEntity>) {
    return this.musicbookRepository.createBook(_jwt.id, _book);
  }

  getMyBook(_jwt: MusicbookJwtPayload) {
    return this.musicbookRepository.findOneBookByUserId(_jwt.id, {
      withJoin: ['broadcaster', 'musics'],
    });
  }

  async updateMyBook(
    _jwt: MusicbookJwtPayload,
    _book: DeepPartial<BookEntity>,
  ) {
    await this.musicbookRepository.updateBook(
      { broadcaster: { id: _jwt.id } },
      _book,
    );
  }

  async deleteMyBook(_jwt: MusicbookJwtPayload) {
    await this.musicbookRepository.deleteBookByUserId(_jwt.id);
  }

  getBook(_bookId: string) {
    return this.musicbookRepository.findOneBookById(_bookId, {
      withJoin: ['broadcaster', 'musics'],
    });
  }

  getLikeCountOfBook(_bookId: string) {
    return this.musicbookLikeRepository.getCountBookLikeByBookId(_bookId);
  }

  async createLikeOfBook(_jwt: MusicbookJwtPayload, _bookId: string) {
    await this.musicbookLikeRepository.createBookLike(_jwt.id, _bookId);
  }

  async deleteLikeOfBook(_jwt: MusicbookJwtPayload, _bookId: string) {
    await this.musicbookLikeRepository.deleteBookLike(_jwt.id, _bookId);
  }

  async getMyLikeOfBook(_jwt: MusicbookJwtPayload, _bookId: string) {
    const like = await this.musicbookLikeRepository.findOneBookLike(
      _jwt.id,
      _bookId,
    );
    return !!like;
  }
}
