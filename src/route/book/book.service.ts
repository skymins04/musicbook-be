import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookEntity } from 'src/common/repository/musicbook/book.entity';
import { MusicBookLikeRepository } from 'src/common/repository/musicbook/musicbook-like.repository';
import { MusicBookRepository } from 'src/common/repository/musicbook/musicbook.repository';
import { DeepPartial } from 'typeorm';
import { CreateBookDTO } from './dto/create-book.dto';
import { CloudflareImagesService } from 'src/common/cloudflare/cloudflare-images.service';
import { GetURLsForBookImgDirectUploadingResponseDataDTO } from './dto/get-direct-upload-url';
import { UpdateMyBookDTO } from './dto/update-my-book.dto';

@Injectable()
export class BookService {
  constructor(
    private readonly musicbookRepository: MusicBookRepository,
    private readonly musicbookLikeRepository: MusicBookLikeRepository,
    private readonly cloudflareImagesService: CloudflareImagesService,
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

  async getURLsForBookImgDirectUploading(
    _jwt: MusicbookJwtPayload,
    _ip: string,
  ): Promise<GetURLsForBookImgDirectUploadingResponseDataDTO> {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 3);

    const [thumbnail, background] = await Promise.all([
      this.cloudflareImagesService.getDirectUploadURL({
        meta: {
          type: 'book_thumbnail',
          uploader: _jwt.id,
          ip: _ip,
          timestamp: new Date().toISOString(),
        },
      }),
      this.cloudflareImagesService.getDirectUploadURL({
        meta: {
          type: 'book_background',
          uploader: _jwt.id,
          ip: _ip,
          timestamp: new Date().toISOString(),
        },
      }),
    ]);

    return {
      thumbnail,
      background,
    };
  }

  async checkBookImagesValidation(_thumbnail: string, _background?: string) {
    const imgIds: string[] = [];
    if (_thumbnail) imgIds.push(_thumbnail);
    if (_background) imgIds.push(_background);
    for (const id of imgIds) {
      try {
        const { result } = await this.cloudflareImagesService.getImageInfo(id);
        if (result.draft) throw new BadRequestException('invaild image');
      } catch (err) {
        throw new BadRequestException('invaild image');
      }
    }

    return {
      thumbnailImgURL:
        _thumbnail && `https://cdnimg.musicbook.kr/${_thumbnail}/public`,
      backroundImgURL:
        _background && `https://cdnimg.musicbook.kr/${_background}/public`,
    };
  }

  async createBook(
    _jwt: MusicbookJwtPayload,
    _book: CreateBookDTO,
  ): Promise<BookEntity> {
    if (await this.musicbookRepository.existBookByUserId(_jwt.id))
      throw new BadRequestException('already created');

    const { thumbnailImgURL, backroundImgURL } =
      await this.checkBookImagesValidation(_book.thumbnail, _book.background);

    return this.musicbookRepository.createBook({
      broadcaster: {
        id: _jwt.id,
      },
      customId: _book.customId || undefined,
      title: _book.title,
      description: _book.description || '',
      requestCommandPrefix: _book.requestCommandPrefix || '!노래책',
      thumbnailURL: thumbnailImgURL,
      backgroundImgURL: backroundImgURL || 'https://exmple.com/example.png',
    });
  }

  async getMyBook(_jwt: MusicbookJwtPayload): Promise<BookEntity> {
    const book = await this.musicbookRepository.findOneBookByUserId(_jwt.id, {
      withJoin: ['broadcaster', 'musics'],
    });
    if (!book) throw new BadRequestException();
    return book;
  }

  async updateMyBook(_jwt: MusicbookJwtPayload, _book: UpdateMyBookDTO) {
    const book = await this.musicbookRepository.findOneBookByUserId(_jwt.id, {
      withJoin: false,
    });
    if (!book) throw new BadRequestException();

    const { thumbnailImgURL, backroundImgURL } =
      await this.checkBookImagesValidation(_book.thumbnail, _book.background);

    if (_book.thumbnail) {
      book.thumbnailURL = thumbnailImgURL;
      delete _book.thumbnail;
    }
    if (_book.background) {
      book.backgroundImgURL = backroundImgURL;
      delete _book.thumbnail;
    }

    for (const key of Object.keys(_book)) {
      book[key] = _book[key];
    }

    await book.save();
  }

  async deleteMyBook(_jwt: MusicbookJwtPayload) {
    if (!(await this.musicbookRepository.existBookByUserId(_jwt.id)))
      throw new BadRequestException('not found book');
    await this.musicbookRepository.deleteBookByUserId(_jwt.id);
  }

  getBook(_bookId: string) {
    const book = this.musicbookRepository.findOneBookById(_bookId, {
      withJoin: ['broadcaster', 'musics'],
    });
    if (!book) throw new NotFoundException();
    return book;
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
