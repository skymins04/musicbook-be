import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/jwt-auth/jwt-auth.guard';
import { BookService } from './book.service';
import { GetBooksDTO, GetBooksResponseDTO } from './dto/get-books.dto';
import {
  ApiResponseDataDTO,
  ApiResponsePagenationDataDTO,
} from 'src/common/api-response/api-response-data.dto';
import { CreateBookDTO } from './dto/create-book.dto';
import { Request } from 'express';
import { GetURLsForBookImgDirectUploadingResponseDTO } from './dto/get-direct-upload-url';
import {
  BookIDAndCustomIdDTO,
  BookIdDTO,
  BookLikeCountResponseDTO,
  BookLikeStatusResponseDTO,
  BookResponseDTO,
} from './dto/book.dto';
import { UpdateMyBookDTO } from './dto/update-my-book.dto';
import { Jwt } from 'src/common/jwt-auth/jwt.decorator';
import { EMusicbookSortMethod } from 'src/common/repository/musicbook/musicbook.enum';
import { BookConfigDTO, BookConfigReponseDTO } from './dto/book-config.dto';
import { ImgFilesInterceptor } from 'src/common/cloudflare-multer/image-files.interceptor';
import { JwtTokenGuard } from 'src/common/jwt-auth/jwt-token.guard';

@Controller('book')
@ApiTags('Book')
export class BookController {
  constructor(private readonly bookSerivce: BookService) {}

  @UseGuards(JwtTokenGuard)
  @Get()
  @ApiOperation({
    summary: '노래책 목록 조회',
    description: '최신순/추천순/인기순 노래책 목록 조회 엔드포인트',
  })
  @ApiOkResponse({
    description: '노래책 목록 조회 성공',
    type: GetBooksResponseDTO,
  })
  async getBooks(
    @Jwt() _jwt: MusicbookJwtPayload,
    @Query() _query: GetBooksDTO,
  ) {
    const { q, page = 1, sort = 'NEWEST', perPage = 30, isLiked } = _query;
    const books = await this.bookSerivce.getBooks(
      perPage,
      page,
      sort,
      q,
      _jwt?.id,
      isLiked,
    );
    return new ApiResponsePagenationDataDTO<{
      sort: keyof typeof EMusicbookSortMethod;
    }>(
      {
        perPage,
        currentPage: page,
        sort,
        pageItemCount: books.length,
      },
      books,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ImgFilesInterceptor(['thumbnail', 'background']))
  @Post()
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '노래책 생성',
    description:
      '노래책 생성 엔드포인트. 한 사용자 당 하나의 노래책만 생성 가능. 복수개의 노래책 생성 시도시 400에러 발생.',
    deprecated: true,
  })
  @ApiOkResponse({
    description: '노래책 생성 성공',
    type: BookResponseDTO,
  })
  async createBook(
    @Jwt() _jwt: MusicbookJwtPayload,
    @UploadedFiles() _files: MulterFiles<'thumbnail' | 'background'>,
    @Body() _body: CreateBookDTO,
  ) {
    if (!_files.thumbnail) throw new BadRequestException();
    return new ApiResponseDataDTO(
      await this.bookSerivce.createBook(_jwt, {
        ..._body,
        thumbnail: _files.thumbnail[0].filename,
        background: _files.background && _files.background[0].filename,
      }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/img_upload_url')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '노래책 썸네일 및 배경 이미지 Direct upload URL 획득',
    description:
      '노래책 썸네일 및 배경 이미지를 Cloudflare images에 Direct upload하기 위한 URL 획득 엔드포인트. 10분 동안 최대 3번 요청 가능.',
    deprecated: true,
  })
  @ApiOkResponse({
    description: 'Direct upload URL 획득',
    type: GetURLsForBookImgDirectUploadingResponseDTO,
  })
  async getURLsForBookImgDirectUploading(
    @Jwt() _jwt: MusicbookJwtPayload,
    @Req() _req: Request,
  ) {
    return new ApiResponseDataDTO(
      await this.bookSerivce.getURLsForBookImgDirectUploading(_jwt, _req.ip),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '본인 노래책 조회',
    description:
      '사용자 본인의 노래책 조회. JWT를 통해 노래책 조회. 생성된 노래책이 없을 경우 400에러 발생.',
  })
  @ApiOkResponse({
    description: '노래책 조회 성공',
    type: BookResponseDTO,
  })
  async getMyBook(@Jwt() _jwt: MusicbookJwtPayload) {
    return new ApiResponseDataDTO(await this.bookSerivce.getMyBook(_jwt));
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ImgFilesInterceptor(['thumbnail', 'background']))
  @Patch('me')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '본인 노래책 수정',
    description:
      '사용자 본인의 노래책 수정 엔드포인트. 생성된 노래책이 없을 경우 400에러 발생.',
  })
  @ApiOkResponse({
    description: '노래책 수정 성공',
  })
  async updateMyBook(
    @Jwt() _jwt: MusicbookJwtPayload,
    @UploadedFiles() _files: MulterFiles<'thumbnail' | 'background'>,
    @Body() _body: UpdateMyBookDTO,
  ) {
    await this.bookSerivce.updateMyBook(_jwt, {
      ..._body,
      thumbnail: _files.thumbnail && _files.thumbnail[0].filename,
      background: _files.background && _files.background[0].filename,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '본인 노래책 삭제',
    description:
      '사용자 본인의 노래책 삭제 엔드포인트. 생성된 노래책이 없을 경우 400에러 발생.',
  })
  async deleteMyBook(@Jwt() _jwt: MusicbookJwtPayload) {
    await this.bookSerivce.deleteMyBook(_jwt);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/config')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '본인 노래책의 설정 조회',
    description:
      '사용자 본인의 노래책 설정 조회 엔드포인트. 생성된 노래책이 없을 경우 400에러 발생.',
  })
  @ApiOkResponse({
    description: '노래책 설정 조회 성공',
    type: BookConfigReponseDTO,
  })
  async getConfigMyBook(@Jwt() _jwt: MusicbookJwtPayload) {
    return new ApiResponseDataDTO(await this.bookSerivce.getConfigMyBook(_jwt));
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/config')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '본인 노래책 설정 적용',
    description:
      '사용자 본인의 노래책 설정 적용 엔드포인트. 생성된 노래책이 없을 경우 400에러 발생.',
  })
  @ApiOkResponse({
    description: '노래책 설정 적용 성공',
    type: BookConfigReponseDTO,
  })
  async setConfigMyBook(
    @Jwt() _jwt: MusicbookJwtPayload,
    @Body() _body: BookConfigDTO,
  ) {
    return new ApiResponseDataDTO(
      await this.bookSerivce.setConfigMyBook(_jwt, _body),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/like')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '본인 노래책 좋아요 개수 조회',
    description:
      '특정 노래책에 대한 좋아요 개수를 조회하는 엔드포인트. 존재하지 않는 노래책일 경우 400에러 발생.',
  })
  @ApiOkResponse({
    description: '노래책 좋아요 개수 조회 성공',
    type: BookLikeCountResponseDTO,
  })
  async getMyBookLikeCount(@Jwt() _jwt: MusicbookJwtPayload) {
    return new ApiResponseDataDTO(
      await this.bookSerivce.getMyBookLikeCount(_jwt),
    );
  }

  @Get(':bookId')
  @ApiOperation({
    summary: '특정 사용자 노래책 조회',
    description:
      '특정 사용자의 노래책 조회 엔드포인트. 생성된 노래책이 없을 경우 404에러 발생.',
  })
  @ApiOkResponse({
    description: '노래책 조회 성공',
    type: BookResponseDTO,
  })
  async getBook(@Param() _param: BookIDAndCustomIdDTO) {
    const { bookId } = _param;
    return new ApiResponseDataDTO(await this.bookSerivce.getBook(bookId));
  }

  @Get(':bookId/like')
  @ApiOperation({
    summary: '노래책 좋아요 개수 조회',
    description:
      '특정 노래책에 대한 좋아요 개수를 조회하는 엔드포인트. 존재하지 않는 노래책일 경우 400에러 발생.',
  })
  @ApiOkResponse({
    description: '노래책 조회 성공',
    type: BookLikeCountResponseDTO,
  })
  async getLikeCountOfBook(
    @Param() _param: BookIdDTO,
  ): Promise<BookLikeCountResponseDTO> {
    const { bookId } = _param;
    return new ApiResponseDataDTO(
      await this.bookSerivce.getLikeCountOfBook(bookId),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':bookId/like')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '노래책 좋아요 생성',
    description:
      '특정 노래책에 대한 좋아요를 생성하는 엔드포인트. 존재하지 않는 노래책일 경우 400에러 발생.',
  })
  @ApiOkResponse({
    description: '노래책 좋아요 여부 생성 성공',
  })
  async createLikeOfBook(
    @Jwt() _jwt: MusicbookJwtPayload,
    @Param() _param: BookIdDTO,
  ) {
    const { bookId } = _param;
    await this.bookSerivce.createLikeOfBook(_jwt, bookId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':bookId/like')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '노래책 좋아요 삭제',
    description:
      '특정 노래책에 대한 좋아요를 삭제하는 엔드포인트. 존재하지 않는 노래책일 경우 400에러 발생.',
  })
  async deleteLikeOfBook(
    @Jwt() _jwt: MusicbookJwtPayload,
    @Param() _param: BookIdDTO,
  ) {
    const { bookId } = _param;
    await this.bookSerivce.deleteLikeOfBook(_jwt, bookId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':bookId/like/me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '노래책 좋아요 여부 조회',
    description:
      '특정 노래책에 대한 좋아요 여부를 조회하는 엔드포인트. 존재하지 않는 노래책일 경우 400에러 발생.',
  })
  @ApiOkResponse({
    description: '노래책 좋아요 여부 조회 성공',
    type: BookLikeStatusResponseDTO,
  })
  async getMyLikeOfBook(
    @Jwt() _jwt: MusicbookJwtPayload,
    @Param() _param: BookIdDTO,
  ) {
    const { bookId } = _param;
    return new ApiResponseDataDTO(
      await this.bookSerivce.getMyLikeOfBook(_jwt, bookId),
    );
  }
}
