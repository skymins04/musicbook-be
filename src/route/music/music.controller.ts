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
import {
  GetMusicsDTO,
  GetMusicsPagenationDTO,
  GetMusicsResponseDTO,
} from './dto/get-musics.dto';
import { MusicService } from './music.service';
import {
  ApiResponseDataDTO,
  ApiResponsePagenationDataDTO,
} from 'src/common/api-response/api-response-data.dto';
import { Jwt } from 'src/common/jwt-auth/jwt.decorator';
import {
  MusicIdDTO,
  MusicLikeCountResponseDTO,
  MusicLikeStatusResponseDTO,
  MusicResponseDTO,
} from './dto/music.dto';
import { GetURLsForMusicSourceImgDirectUploadingResponseDTO } from './dto/get-direct-upload-url';
import { Request } from 'express';
import {
  CreateMelonSourceDTO,
  CreateOriginalSourceDTO,
} from './dto/create-music-source.dto';
import { EMusicbookSortMethod } from 'src/common/repository/musicbook/musicbook.enum';
import { CreateMusicDTO } from './dto/create-music.dto';
import { UpdateMyMusicDTO } from './dto/update-my-music.dto';

@Controller('music')
@ApiTags('Music')
export class MusicController {
  constructor(private readonly musciService: MusicService) {}

  @Get()
  @ApiOperation({
    summary: '수록곡 목록 조회',
    description: '최신순/추천순/인기순 수록곡 목록 조회 엔드포인트',
  })
  @ApiOkResponse({
    description: '수록곡 목록 조회 성공',
    type: GetMusicsResponseDTO,
  })
  async getMusics(@Query() _query: GetMusicsDTO) {
    const {
      perPage = 30,
      page = 1,
      sort = 'NEWEST',
      category,
      bookId,
    } = _query;
    const musics = await this.musciService.getMusics(perPage, page, sort, {
      category,
      bookId,
    });
    return new ApiResponsePagenationDataDTO<{
      sort: keyof typeof EMusicbookSortMethod;
    }>(
      { perPage, currentPage: page, sort, pageItemCount: musics.length },
      musics,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: '수록곡 생성',
    description:
      '수록곡 생성 엔드포인트. 노래책이 생성되지 않은 사용자는 400에러 발생.',
  })
  @ApiOkResponse({
    description: '수록곡 목록 조회 성공',
    type: MusicResponseDTO,
  })
  async createMusic(
    @Jwt() _jwt: MusicbookJwtPayload,
    @Body() _body: CreateMusicDTO,
  ): Promise<MusicResponseDTO> {
    return new ApiResponseDataDTO(
      await this.musciService.createMusic(_jwt, _body),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('source/original')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '고유 수록곡 source 생성',
    description: 'original source 생성 엔드포인트.',
  })
  @ApiOkResponse({
    description: '생성 성공',
  })
  async createOriginalSource(@Body() _body: CreateOriginalSourceDTO) {
    await this.musciService.createOriginalSource(_body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('source/original/img_upload_url')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '고유 수록곡 source의 이미지 Direct upload URL 획득',
    description:
      '고유 수록곡 source의 이미지를 Cloudflare images에 Direct upload하기 위한 URL 획득 엔드포인트. 1분 동안 최대 3번 요청 가능.',
  })
  @ApiOkResponse({
    description: 'Direct upload URL 획득',
    type: GetURLsForMusicSourceImgDirectUploadingResponseDTO,
  })
  async getURLsForMusicSourceImgDirectUploading(
    @Jwt() _jwt: MusicbookJwtPayload,
    @Req() _req: Request,
  ) {
    return new ApiResponseDataDTO(
      await this.musciService.getURLsForMusicSourceImgDirectUploading(
        _jwt,
        _req.ip,
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('source/melon')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'melon 수록곡 source 생성',
    description: 'melon source 생성 엔드포인트.',
  })
  async createMelonSource(@Body() _body: CreateMelonSourceDTO) {
    const { id } = _body;
    await this.musciService.createMelonSource(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '본인 수록곡 목록 조회',
    description:
      '사용자 본인의 수록곡 목록 조회 엔드포인트. 노래책이 생성되지 않은 사용자는 400에러 발생.',
  })
  @ApiOkResponse({
    description: '수록곡 조회 성공',
    type: GetMusicsResponseDTO,
  })
  async getMyMusics(
    @Jwt() _jwt: MusicbookJwtPayload,
    @Query() _query: GetMusicsPagenationDTO,
  ) {
    const { perPage = 30, page = 1, sort = 'NEWEST', category } = _query;
    const musics = await this.musciService.getMusics(perPage, page, sort, {
      category,
      userId: _jwt.id,
    });

    return new ApiResponsePagenationDataDTO<{
      sort: keyof typeof EMusicbookSortMethod;
    }>(
      { perPage, currentPage: page, sort, pageItemCount: musics.length },
      musics,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: '수록곡 조회',
    description:
      '수록곡 조회 엔드포인트. 존재하지 않는 수록곡일 경우 404에러 발생.',
  })
  @ApiOkResponse({
    description: '수록곡 조회 성공',
    type: MusicResponseDTO,
  })
  async getMusic(@Param() _param: MusicIdDTO) {
    const { id } = _param;
    return new ApiResponseDataDTO(await this.musciService.getMusic(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '본인 수록곡 수정',
    description:
      '사용자 본인의 수록곡 수정 엔드포인트. 존재하지 않는 수록곡일 경우 400에러 발생.',
  })
  async updateMyMusic(
    @Jwt() _jwt,
    @Param() _param: MusicIdDTO,
    @Body() _body: UpdateMyMusicDTO,
  ) {
    const { id } = _param;
    await this.musciService.updateMyMusic(_jwt, id, _body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '본인 수록곡 삭제',
    description:
      '사용자 본인의 수록곡 삭제 엔드포인트. 존재하지 않는 수록곡일 경우 400에러 발생.',
  })
  @ApiOkResponse({
    description: '수록곡 삭제 성공',
  })
  async deleteMusic(@Jwt() _jwt, @Param() _param: MusicIdDTO) {
    const { id } = _param;
    await this.musciService.deleteMusic(_jwt, id);
  }

  @Get(':id/like')
  @ApiOperation({
    summary: '수록곡 좋아요 개수 조회',
    description:
      '특정 수록곡에 대한 좋아요 개수를 조회하는 엔드포인트. 존재하지 않는 수록곡일 경우 400에러 발생.',
  })
  @ApiOkResponse({
    description: '수록곡 생성 성공',
    type: MusicLikeCountResponseDTO,
  })
  async getLikeCountOfMusic(@Param() _param: MusicIdDTO) {
    const { id } = _param;
    return new ApiResponseDataDTO(
      await this.musciService.getLikeCountOfMusic(id),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '수록곡 좋아요 생성',
    description:
      '특정 수록곡에 대한 좋아요를 생성하는 엔드포인트. 존재하지 않는 수록곡일 경우 400에러 발생.',
  })
  @ApiOkResponse({
    description: '수록곡 좋아요 생성 성공',
  })
  async createLikeOfMusic(
    @Jwt() _jwt: MusicbookJwtPayload,
    @Param() _param: MusicIdDTO,
  ) {
    const { id } = _param;
    await this.musciService.createLikeOfMusic(_jwt, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '수록곡 좋아요 삭제',
    description:
      '특정 수록곡에 대한 좋아요를 삭제하는 엔드포인트. 존재하지 않는 수록곡일 경우 400에러 발생.',
  })
  @ApiOkResponse({
    description: '수록곡 좋아요 삭제 성공',
  })
  async deleteLikeOfMusic(
    @Jwt() _jwt: MusicbookJwtPayload,
    @Param() _param: MusicIdDTO,
  ) {
    const { id } = _param;
    await this.musciService.deleteLikeOfMusic(_jwt, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/like/me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '수록곡 좋아요 여부 조회',
    description:
      '특정 수록곡에 대한 좋아요 여부를 조회하는 엔드포인트. 존재하지 않는 수록곡일 경우 400에러 발생.',
  })
  @ApiOkResponse({
    description: '수록곡 좋아요 조회 성공',
    type: MusicLikeStatusResponseDTO,
  })
  async getMyLikeOfMusic(
    @Jwt() _jwt: MusicbookJwtPayload,
    @Param() _param: MusicIdDTO,
  ) {
    const { id } = _param;
    return new ApiResponseDataDTO(
      await this.musciService.getMyLikeOfMusic(_jwt, id),
    );
  }
}
