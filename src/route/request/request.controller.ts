import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/jwt-auth/jwt-auth.guard';

@Controller('request')
@ApiTags('Request')
export class RequestController {
  @UseGuards(JwtAuthGuard)
  @Post(':musicId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '(wip) 신청곡 추가',
    description:
      '신청곡을 추가하는 엔드포인트. 존재하지 않는 수록곡일 경우 400에러 발생.',
  })
  async createSongRequest() {}

  @UseGuards(JwtAuthGuard)
  @Delete(':requestId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '(wip) 신청곡 취소',
    description:
      '신청곡을 취소하는 엔드포인트. 존재하지 않는 신청곡일 경우 400에러 발생.',
  })
  async deleteSongRequest() {}

  @Get('me')
  @ApiOperation({
    summary: '(wip) 본인 신청곡 목록 조회',
    description:
      '완료되지 않은 신청곡 목록을 조회하는 엔드포인트. 존재하지 않는 노래책일 경우 400에러 발생.',
  })
  async getMySongRequests() {}

  @Get('queue/:bookId')
  @ApiOperation({
    summary: '(wip) 특정 노래책의 신청곡 큐 조회',
    description:
      '특정 노래책의 신청곡 큐를 조회하는 엔드포인트. 존재하지 않는 노래책일 경우 400에러 발생.',
  })
  async getSongRequestQueue() {}

  @UseGuards(JwtAuthGuard)
  @Get('queue/me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '(wip) 본인 노래책의 신청곡 큐 조회',
    description:
      '본인 노래책의 신청곡 큐를 조회하는 엔드포인트. 노래책이 생성되지 않았을 경우 400에러 발생.',
  })
  async getMySongRequestQueue() {}

  @UseGuards(JwtAuthGuard)
  @Get('blacklist')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '(wip) 본인 노래책의 유저 블랙리스트 조회',
    description:
      '본인 노래책에 대한 신청곡 요청을 막은 유저 목록을 조회하는 엔드포인트. 노래책이 생성되지 않았을 경우 400에러 발생.',
  })
  async getSongRequestBlacklist() {}

  @UseGuards(JwtAuthGuard)
  @Post('blacklist')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '(wip) 본인 노래책의 유저 블랙리스트에 유저 추가',
    description:
      '본인 노래책에 대한 신청곡 요청을 막을 유저를 추가하는 엔드포인트. 노래책이 생성되지 않았을 경우 400에러 발생.',
  })
  async addUserToSongRequestBlacklist() {}

  @UseGuards(JwtAuthGuard)
  @Delete('blacklist')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '(wip) 본인 노래책의 유저 블랙리스트에서 유저 제거',
    description:
      '본인 노래책에 대한 신청곡 요청을 막은 유저를 다시 허용하는 엔드포인트. 노래책이 생성되지 않았을 경우 400에러 발생.',
  })
  async removeUserToSongRequest() {}
}
