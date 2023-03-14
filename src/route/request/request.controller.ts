import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
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
  RequestBlacklistResponseDTO,
  RequestBookIdDTO,
  RequestIdDTO,
  RequestMusicIdDTO,
  RequestResponseDTO,
  RequestUserIdDTO,
} from './dto/request.dto';
import { Jwt } from 'src/common/jwt-auth/jwt.decorator';
import { RequestService } from './request.service';
import { ApiResponseDataDTO } from 'src/common/api-response/api-response-data.dto';

@Controller('request')
@ApiTags('Request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '본인 신청곡 목록 조회',
    description:
      '완료되지 않은 신청곡 목록을 조회하는 엔드포인트. 존재하지 않는 노래책일 경우 400에러 발생.',
  })
  @ApiOkResponse({
    description: '신청곡 목록 조회 성공',
    type: RequestResponseDTO,
  })
  async getMySongRequests(@Jwt() _jwt: MusicbookJwtPayload) {
    return new ApiResponseDataDTO(
      await this.requestService.getMySongRequests(_jwt),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('queue/me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '본인 노래책의 신청곡 큐 조회',
    description:
      '본인 노래책의 신청곡 큐를 조회하는 엔드포인트. 노래책이 생성되지 않았을 경우 400에러 발생.',
  })
  @ApiOkResponse({
    description: '신청곡 큐 조회 성공',
    type: RequestResponseDTO,
  })
  async getMySongRequestQueue(@Jwt() _jwt: MusicbookJwtPayload) {
    return new ApiResponseDataDTO(
      await this.requestService.getMySongRequestQueue(_jwt),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('queue/recover')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '본인 노래책의 신청곡 큐 복구',
    description:
      '본인 노래책의 신청곡 큐를 복구하는 엔드포인트. 노래책이 생성되지 않았을 경우 400에러 발생.',
  })
  @ApiOkResponse({
    description: '신청곡 큐 복구 성공',
    type: RequestResponseDTO,
  })
  async recoverMySongRequestQueue(@Jwt() _jwt: MusicbookJwtPayload) {
    await this.requestService.recoverMySongRequestQueue(_jwt);
  }

  @Get('queue/:bookId')
  @ApiOperation({
    summary: '특정 노래책의 신청곡 큐 조회',
    description:
      '특정 노래책의 신청곡 큐를 조회하는 엔드포인트. 존재하지 않는 노래책일 경우 400에러 발생.',
  })
  @ApiOkResponse({
    description: '신청곡 큐 조회 성공',
    type: RequestResponseDTO,
  })
  async getSongRequestQueue(@Param() _param: RequestBookIdDTO) {
    const { bookId } = _param;
    return new ApiResponseDataDTO(
      await this.requestService.getSongRequestQueue(bookId),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('blacklist')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '본인 노래책의 유저 블랙리스트 조회',
    description:
      '본인 노래책에 대한 신청곡 요청을 막은 유저 목록을 조회하는 엔드포인트. 노래책이 생성되지 않았을 경우 400에러 발생.',
  })
  @ApiOkResponse({
    description: '유저 블랙리스트 조회 성공',
    type: RequestBlacklistResponseDTO,
  })
  async getSongRequestBlacklist(@Jwt() _jwt: MusicbookJwtPayload) {
    return new ApiResponseDataDTO(
      await this.requestService.getSongRequestBlacklist(_jwt),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('blacklist/:userId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '본인 노래책의 유저 블랙리스트에 유저 추가',
    description:
      '본인 노래책에 대한 신청곡 요청을 막을 유저를 추가하는 엔드포인트. 노래책이 생성되지 않았을 경우 400에러 발생.',
  })
  async addUserToSongRequestBlacklist(
    @Jwt() _jwt: MusicbookJwtPayload,
    @Param() _param: RequestUserIdDTO,
  ) {
    const { userId } = _param;
    await this.requestService.addUserToSongRequestBlacklist(_jwt, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('blacklist/:userId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '본인 노래책의 유저 블랙리스트에서 유저 제거',
    description:
      '본인 노래책에 대한 신청곡 요청을 막은 유저를 다시 허용하는 엔드포인트. 노래책이 생성되지 않았을 경우 400에러 발생.',
  })
  async removeUserToSongRequest(
    @Jwt() _jwt: MusicbookJwtPayload,
    @Param() _param: RequestUserIdDTO,
  ) {
    const { userId } = _param;
    await this.requestService.removeUserToSongRequest(_jwt, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':musicId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '신청곡 추가',
    description:
      '신청곡을 추가하는 엔드포인트. 존재하지 않는 수록곡일 경우 400에러 발생.',
  })
  async createSongRequest(
    @Jwt() _jwt: MusicbookJwtPayload,
    @Param() _param: RequestMusicIdDTO,
  ) {
    const { musicId } = _param;
    await this.requestService.createSongRequest(_jwt, musicId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':requestId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '신청곡 취소',
    description:
      '본인이 신청한 신청곡 또는 본인의 노래책에 대한 신청곡을 취소하는 엔드포인트. 존재하지 않는 신청곡일 경우 400에러 발생.',
  })
  async deleteSongRequest(
    @Jwt() _jwt: MusicbookJwtPayload,
    @Param() _param: RequestIdDTO,
  ) {
    const { requestId } = _param;
    await this.requestService.deleteSongRequest(_jwt, requestId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':requestId/up')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '본인 노래책에 대한 신청곡의 순서를 한 칸 올림',
    description:
      '본인 노래책에 대한 신청곡의 순서를 한 칸 올리는 엔드포인트. 노래책 주인이 아니거나 존재하지 않는 신청곡일 경우 400에러 발생.',
  })
  async moveUpSongRequest(
    @Jwt() _jwt: MusicbookJwtPayload,
    @Param() _param: RequestIdDTO,
  ) {
    const { requestId } = _param;
    await this.requestService.moveUpSongRequest(_jwt, requestId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':requestId/down')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '본인 노래책에 대한 신청곡의 순서를 한 칸 내림',
    description:
      '본인 노래책에 대한 신청곡의 순서를 한 칸 내리는 엔드포인트. 노래책 주인이 아니거나 존재하지 않는 신청곡일 경우 400에러 발생.',
  })
  async moveDownSongRequest(
    @Jwt() _jwt: MusicbookJwtPayload,
    @Param() _param: RequestIdDTO,
  ) {
    const { requestId } = _param;
    await this.requestService.moveDownSongRequest(_jwt, requestId);
  }
}
