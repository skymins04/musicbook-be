import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/jwt-auth/jwt-auth.guard';

@Controller('music')
@ApiTags('Music')
export class MusicController {
  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: '(wip) 수록곡 목록 조회',
    description: '최신순/추천순/인기순 수록곡 목록 조회 엔드포인트',
  })
  getMusics() {}

  @UseGuards(JwtAuthGuard)
  @Post('original')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '(wip) original source 기반 수록곡 생성',
    description:
      'original source를 이용한 수록곡 생성 엔드포인트. 노래책이 생성되지 않은 사용자는 400에러 발생.',
  })
  createMusicByOriginal() {}

  @UseGuards(JwtAuthGuard)
  @Post('melon')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '(wip) melon source 기반 수록곡 생성',
    description:
      'melon source를 이용한 수록곡 생성 엔드포인트. 노래책이 생성되지 않은 사용자는 400에러 발생.',
  })
  createMusicByMelon() {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '(wip) 본인 수록곡 목록 조회',
    description:
      '사용자 본인의 수록곡 목록 조회 엔드포인트. 노래책이 생성되지 않은 사용자는 400에러 발생.',
  })
  getMyMusics() {}

  @Get(':id')
  @ApiOperation({
    summary: '(wip) 수록곡 조회',
    description:
      '수록곡 조회 엔드포인트. 존재하지 않는 수록곡일 경우 404에러 발생.',
  })
  getMusic() {}

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '(wip) 본인 수록곡 수정',
    description:
      '사용자 본인의 수록곡 수정 엔드포인트. 존재하지 않는 수록곡일 경우 404에러 발생.',
  })
  updateMusic() {}

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '(wip) 본인 수록곡 삭제',
    description:
      '사용자 본인의 수록곡 삭제 엔드포인트. 존재하지 않는 수록곡일 경우 400에러 발생.',
  })
  deleteMusic() {}

  @Get(':id/like')
  @ApiOperation({
    summary: '(wip) 수록곡 좋아요 개수 조회',
    description:
      '특정 수록곡에 대한 좋아요 개수를 조회하는 엔드포인트. 존재하지 않는 수록곡일 경우 400에러 발생.',
  })
  getLikeCountOfMusic() {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '(wip) 수록곡 좋아요 생성',
    description:
      '특정 수록곡에 대한 좋아요를 생성하는 엔드포인트. 존재하지 않는 수록곡일 경우 400에러 발생.',
  })
  createLikeOfMusic() {}

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '(wip) 수록곡 좋아요 삭제',
    description:
      '특정 수록곡에 대한 좋아요를 삭제하는 엔드포인트. 존재하지 않는 수록곡일 경우 400에러 발생.',
  })
  deleteLikeOfMusic() {}

  @UseGuards(JwtAuthGuard)
  @Get(':id/like/me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '(wip) 수록곡 좋아요 여부 조회',
    description:
      '특정 수록곡에 대한 좋아요 여부를 조회하는 엔드포인트. 존재하지 않는 수록곡일 경우 400에러 발생.',
  })
  getMyLikeOfMusic() {}
}
