import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookEntity } from 'src/common/repository/musicbook/book.entity';
import { MusicBookLikeRepository } from 'src/common/repository/musicbook/musicbook-like.repository';
import { MusicBookRepository } from 'src/common/repository/musicbook/musicbook.repository';
import { CreateBookDTO } from './dto/create-book.dto';
import { CloudflareImagesService } from 'src/common/cloudflare/cloudflare-images.service';
import { GetURLsForBookImgDirectUploadingResponseDataDTO } from './dto/get-direct-upload-url';
import { UpdateMyBookDTO } from './dto/update-my-book.dto';
import { EMusicbookSortMethod } from 'src/common/repository/musicbook/musicbook.enum';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class BookService {
  constructor(
    private readonly musicbookRepository: MusicBookRepository,
    private readonly musicbookLikeRepository: MusicBookLikeRepository,
    private readonly cloudflareImagesService: CloudflareImagesService,
    private readonly redisService: RedisService,
  ) {}

  private getBooksSortHandler: Record<
    keyof typeof EMusicbookSortMethod,
    (_perPage: number, _page: number) => Promise<BookEntity[]>
  > = {
    NEWEST: (_perPage, _page) => {
      return this.musicbookRepository.findManyNewestBook(_perPage, _page);
    },
    SUGGEST: (_perPage, _page) => {
      return this.musicbookRepository.findManySuggestBook(_perPage, _page);
    },
    POPULAR: (_perPage, _page) => {
      return this.musicbookRepository.findManyPopularBook(_perPage, _page);
    },
  };

  getBooks(
    _perPage: number,
    _page: number,
    _sort: keyof typeof EMusicbookSortMethod,
  ) {
    return this.getBooksSortHandler[_sort](_perPage, _page);
  }

  async getURLsForBookImgDirectUploading(
    _jwt: MusicbookJwtPayload,
    _ip: string,
  ): Promise<GetURLsForBookImgDirectUploadingResponseDataDTO> {
    await this.redisService.checkRequestCooltime(
      `cooltime:book_img_upload_url:${_jwt.id}`,
      3,
      60 * 10,
    );

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

  getMyBookLikeCount(_jwt: MusicbookJwtPayload) {
    return this.musicbookLikeRepository.getCountBookLikeByUserId(_jwt.id);
  }

  async getBook(_bookId: string) {
    const book = await this.musicbookRepository.findOneBookById(_bookId, {
      withJoin: ['broadcaster', 'musics'],
    });
    if (!book) throw new NotFoundException();
    return book;
  }

  async getLikeCountOfBook(_bookId: string) {
    const book = await this.musicbookRepository.findOneBookById(_bookId);
    if (!book) throw new BadRequestException();
    return book.likeCount;
  }

  async createLikeOfBook(_jwt: MusicbookJwtPayload, _bookId: string) {
    await this.musicbookLikeRepository.createBookLike(_jwt.id, _bookId);
  }

  async deleteLikeOfBook(_jwt: MusicbookJwtPayload, _bookId: string) {
    await this.musicbookLikeRepository.deleteBookLike(_jwt.id, _bookId);
  }

  async getMyLikeOfBook(_jwt: MusicbookJwtPayload, _bookId: string) {
    if (!(await this.musicbookRepository.existBookById(_bookId)))
      throw new BadRequestException();
    return this.musicbookLikeRepository.existBookLike(_jwt.id, _bookId);
  }
}
