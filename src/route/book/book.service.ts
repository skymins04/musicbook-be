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
import { BookConfigDTO, BookConfigReponseDataDTO } from './dto/book-config.dto';
import { getCloudflareImagesFileURL } from 'src/common/cloudflare-multer/getCloudflareFileURL';

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
    (_perPage: number, _page: number, _q?: string) => Promise<BookEntity[]>
  > = {
    NEWEST: (_perPage, _page, _q) => {
      return this.musicbookRepository.findManyNewestBook(_perPage, _page, _q);
    },
    SUGGEST: (_perPage, _page, _q) => {
      return this.musicbookRepository.findManySuggestBook(_perPage, _page, _q);
    },
    POPULAR: (_perPage, _page, _q) => {
      return this.musicbookRepository.findManyPopularBook(_perPage, _page, _q);
    },
  };

  getBooks(
    _perPage: number,
    _page: number,
    _sort: keyof typeof EMusicbookSortMethod,
    _q?: string,
  ) {
    return this.getBooksSortHandler[_sort](_perPage, _page, _q);
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
      this.cloudflareImagesService.getDirectUploadURLWithMetadata(
        'book_thumbnail',
        _jwt.id,
        _ip,
      ),
      this.cloudflareImagesService.getDirectUploadURLWithMetadata(
        'book_background',
        _jwt.id,
        _ip,
      ),
    ]);

    return {
      thumbnail,
      background,
    };
  }

  async checkBookImagesValidation(
    _jwt: MusicbookJwtPayload,
    _thumbnail: string,
    _background?: string,
  ) {
    const imgs: { id: string; type: string }[] = [];
    if (_thumbnail) imgs.push({ id: _thumbnail, type: 'book_thumbnail' });
    if (_background) imgs.push({ id: _background, type: 'book_background' });
    for (const img of imgs) {
      await this.cloudflareImagesService.validateImage(
        img.id,
        _jwt.id,
        img.type,
      );
    }

    return {
      thumbnailImgURL:
        _thumbnail &&
        `${process.env.CLOUDFLARE_IMAGES_CDN_ADDRESS}/${_thumbnail}/public`,
      backroundImgURL:
        _background &&
        `${process.env.CLOUDFLARE_IMAGES_CDN_ADDRESS}/${_background}/public`,
    };
  }

  async createBook(
    _jwt: MusicbookJwtPayload,
    _book: CreateBookDTO,
  ): Promise<BookEntity> {
    if (await this.musicbookRepository.existBookByUserId(_jwt.id))
      throw new BadRequestException('already created');
    if (
      _book.customId &&
      (await this.musicbookRepository.existBookByCustomId(_book.customId))
    )
      throw new BadRequestException('already used custom ID');

    return this.musicbookRepository.createBook({
      broadcaster: {
        id: _jwt.id,
      },
      customId: _book.customId,
      title: _book.title,
      description: _book.description || '',
      requestCommandPrefix: _book.requestCommandPrefix || '!노래책',
      thumbnailURL: getCloudflareImagesFileURL(_book.thumbnail),
      backgroundImgURL: _book.background
        ? getCloudflareImagesFileURL(_book.background)
        : 'https://exmple.com/example.png',
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
    if (
      _book.customId &&
      (await this.musicbookRepository.existBookByCustomId(_book.customId))
    )
      throw new BadRequestException('already used custom ID');

    await this.musicbookRepository.updateBook(book.id, {
      customId: _book.customId,
      title: _book.title,
      description: _book.description,
      requestCommandPrefix: _book.requestCommandPrefix,
      thumbnailURL:
        _book.thumbnail && getCloudflareImagesFileURL(_book.thumbnail),
      backgroundImgURL:
        _book.background && getCloudflareImagesFileURL(_book.background),
    });
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
    let book: BookEntity;
    if (_bookId.match(/^@[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣-_]{1,20}$/)) {
      book = await this.musicbookRepository.findOneBookByCustomBookId(_bookId, {
        withJoin: ['broadcaster', 'musics'],
      });
    } else {
      book = await this.musicbookRepository.findOneBookById(_bookId, {
        withJoin: ['broadcaster', 'musics'],
      });
    }
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

  async getConfigMyBook(
    _jwt: MusicbookJwtPayload,
  ): Promise<BookConfigReponseDataDTO> {
    const book = await this.musicbookRepository.findOneBookByUserId(_jwt.id);
    if (!book) throw new BadRequestException();

    return {
      isHide: book.isHide,
      isPaid: book.isPaid,
      isAllowDuplicateRequest: book.isAllowDuplicateRequest,
      isAllowRequest: book.isAllowRequest,
      isAllowRequestLimit: book.isAllowRequestLimit,
      requestLimitCount: book.requestLimitCount,
    };
  }

  async setConfigMyBook(
    _jwt: MusicbookJwtPayload,
    _config: BookConfigDTO,
  ): Promise<BookConfigReponseDataDTO> {
    const book = await this.musicbookRepository.findOneBookByUserId(_jwt.id);
    if (!book) throw new BadRequestException();
    for (const key of Object.keys(_config)) {
      book[key] = _config[key];
    }
    await book.save();

    return {
      isHide: book.isHide,
      isPaid: book.isPaid,
      isAllowDuplicateRequest: book.isAllowDuplicateRequest,
      isAllowRequest: book.isAllowRequest,
      isAllowRequestLimit: book.isAllowRequestLimit,
      requestLimitCount: book.requestLimitCount,
    };
  }

  async searchBooks(
    _perPage: number,
    _page: number,
    _sort: keyof typeof EMusicbookSortMethod,
    _q: string,
  ) {
    return this.getBooksSortHandler[_sort](_perPage, _page, _q);
  }
}
