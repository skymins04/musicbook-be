import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/jwt-auth/jwt-auth.guard';
import { BookService } from './book.service';
import { JwtAuthService } from 'src/common/jwt-auth/jwt-auth.service';
import { GetBooksDTO, GetBooksResponseDTO } from './dto/get-books.dto';
import {
  ApiResponseDataDTO,
  ApiResponsePagenationDataDTO,
} from 'src/common/api-response/api-response-data.dto';
import { CreateBookDTO } from './dto/create-book.dto';
import { Request } from 'express';
import { GetURLsForBookImgDirectUploadingResponseDTO } from './dto/get-direct-upload-url';
import {
  BookIdDTO,
  BookLikeCountResponseDTO,
  BookLikeStatusResponseDTO,
  BookResponseDTO,
} from './dto/book.dto';
import { UpdateMyBookDTO } from './dto/update-my-book.dto';

@Controller('book')
@ApiTags('Book')
export class BookController {
  constructor(
    private readonly bookSerivce: BookService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '노래책 목록 조회',
    description: '최신순/추천순/인기순 노래책 목록 조회 엔드포인트',
  })
  @ApiOkResponse({
    description: '노래책 목록 조회 성공',
    type: GetBooksResponseDTO,
  })
  async getBooks(@Query() _query: GetBooksDTO) {
    const { perPage = 30, page = 1, sort = 'newest' } = _query;
    const books = await this.bookSerivce.getBooks(perPage, page, sort);
    return new ApiResponsePagenationDataDTO<{ sort: MusicbookSortMethod }>(
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
  @Get('/img_upload_url')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '노래책 썸네일 및 배경 이미지 Direct upload URL 획득',
    description:
      '노래책 썸네일 및 배경 이미지를 Cloudflare images에 Direct upload하기 위한 URL 획득 엔드포인트. 10분 동안 최대 3번 요청 가능.',
  })
  @ApiOkResponse({
    description: 'Direct upload URL 획득',
    type: GetURLsForBookImgDirectUploadingResponseDTO,
  })
  async getURLsForBookImgDirectUploading(
    @Req() _req: Request,
  ): Promise<GetURLsForBookImgDirectUploadingResponseDTO> {
    const jwt = this.jwtAuthService.getJwtAndVerifyFromReq(_req);
    const ip = _req.ip;
    return new ApiResponseDataDTO(
      await this.bookSerivce.getURLsForBookImgDirectUploading(jwt, ip),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: '노래책 생성',
    description:
      '노래책 생성 엔드포인트. 한 사용자 당 하나의 노래책만 생성 가능. 복수개의 노래책 생성 시도시 400에러 발생.',
  })
  @ApiOkResponse({
    description: '노래책 생성 성공',
    type: BookResponseDTO,
  })
  async createBook(
    @Req() _req: Request,
    @Body() _body: CreateBookDTO,
  ): Promise<BookResponseDTO> {
    const jwt = this.jwtAuthService.getJwtAndVerifyFromReq(_req);
    return new ApiResponseDataDTO(
      await this.bookSerivce.createBook(jwt, _body),
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({
    summary: '본인 노래책 조회',
    description:
      '사용자 본인의 노래책 조회. JWT를 통해 노래책 조회. 생성된 노래책이 없을 경우 400에러 발생.',
  })
  @ApiOkResponse({
    description: '노래책 조회 성공',
    type: BookResponseDTO,
  })
  async getMyBook(@Req() _req: Request): Promise<BookResponseDTO> {
    const jwt = this.jwtAuthService.getJwtAndVerifyFromReq(_req);
    return new ApiResponseDataDTO(await this.bookSerivce.getMyBook(jwt));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('me')
  @ApiOperation({
    summary: '본인 노래책 수정',
    description:
      '사용자 본인의 노래책 수정. 생성된 노래책이 없을 경우 400에러 발생.',
  })
  @ApiOkResponse({
    description: '노래책 수정 성공',
  })
  async updateMyBook(@Req() _req: Request, @Body() _body: UpdateMyBookDTO) {
    const jwt = this.jwtAuthService.getJwtAndVerifyFromReq(_req);
    await this.bookSerivce.updateMyBook(jwt, _body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('me')
  @ApiOperation({
    summary: '본인 노래책 삭제',
    description:
      '사용자 본인의 노래책 삭제. 생성된 노래책이 없을 경우 400에러 발생.',
  })
  async deleteMyBook(@Req() _req: Request) {
    const jwt = this.jwtAuthService.getJwtAndVerifyFromReq(_req);
    await this.bookSerivce.deleteMyBook(jwt);
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
  async getMyBookLikeCount(
    @Req() _req: Request,
  ): Promise<BookLikeCountResponseDTO> {
    const jwt = this.jwtAuthService.getJwtAndVerifyFromReq(_req);
    return new ApiResponseDataDTO(
      await this.bookSerivce.getMyBookLikeCount(jwt),
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: '특정 사용자 노래책 조회',
    description:
      '특정 사용자의 노래책 조회. 생성된 노래책이 없을 경우 404에러 발생.',
  })
  @ApiOkResponse({
    description: '노래책 조회 성공',
    type: BookResponseDTO,
  })
  async getBook(@Param() _param: BookIdDTO) {
    const { id } = _param;
    return new ApiResponseDataDTO(await this.bookSerivce.getBook(id));
  }

  @Get(':id/like')
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
    const { id } = _param;
    return new ApiResponseDataDTO(
      await this.bookSerivce.getLikeCountOfBook(id),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '노래책 좋아요 생성',
    description:
      '특정 노래책에 대한 좋아요를 생성하는 엔드포인트. 존재하지 않는 노래책일 경우 400에러 발생.',
  })
  @ApiOkResponse({
    description: '노래책 좋아요 여부 생성 성공',
  })
  async createLikeOfBook(@Req() _req: Request, @Param() _param: BookIdDTO) {
    const jwt = this.jwtAuthService.getJwtAndVerifyFromReq(_req);
    const { id } = _param;
    await this.bookSerivce.createLikeOfBook(jwt, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '노래책 좋아요 삭제',
    description:
      '특정 노래책에 대한 좋아요를 삭제하는 엔드포인트. 존재하지 않는 노래책일 경우 400에러 발생.',
  })
  async deleteLikeOfBook(@Req() _req: Request, @Param() _param: BookIdDTO) {
    const jwt = this.jwtAuthService.getJwtAndVerifyFromReq(_req);
    const { id } = _param;
    await this.bookSerivce.deleteLikeOfBook(jwt, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/like/me')
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
    @Req() _req: Request,
    @Param() _param: BookIdDTO,
  ): Promise<BookLikeStatusResponseDTO> {
    const jwt = this.jwtAuthService.getJwtAndVerifyFromReq(_req);
    const { id } = _param;
    return new ApiResponseDataDTO(
      await this.bookSerivce.getMyLikeOfBook(jwt, id),
    );
  }
}
