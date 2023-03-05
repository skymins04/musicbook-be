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

@Controller('book')
@ApiTags('Book')
export class BookController {
  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: '(wip) 노래책 목록 조회',
    description: '최신순/추천순/인기순 노래책 목록 조회 엔드포인트',
  })
  getBooks() {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: '(wip) 노래책 생성',
    description:
      '노래책 생성 엔드포인트. 한 사용자 당 하나의 노래책만 생성 가능. 복수개의 노래책 생성 시도시 400에러 발생.',
  })
  createBook() {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({
    summary: '(wip) 본인 노래책 조회',
    description:
      '사용자 본인의 노래책 조회. JWT를 통해 노래책 조회. 생성된 노래책이 없을 경우 400에러 발생.',
  })
  getMyBook() {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('me')
  @ApiOperation({
    summary: '(wip) 본인 노래책 수정',
    description:
      '사용자 본인의 노래책 수정. 생성된 노래책이 없을 경우 400에러 발생.',
  })
  updateMyBook() {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('me')
  @ApiOperation({
    summary: '(wip) 본인 노래책 삭제',
    description:
      '사용자 본인의 노래책 삭제. 생성된 노래책이 없을 경우 400에러 발생.',
  })
  deleteMyBook() {}

  @Get(':id')
  @ApiOperation({
    summary: '(wip) 특정 사용자 노래책 조회',
    description:
      '특정 사용자의 노래책 조회. 생성된 노래책이 없을 경우 404에러 발생.',
  })
  getBook() {}

  @Get(':id/like')
  @ApiOperation({
    summary: '(wip) 노래책 좋아요 개수 조회',
    description:
      '특정 노래책에 대한 좋아요 개수를 조회하는 엔드포인트. 존재하지 않는 노래책일 경우 400에러 발생.',
  })
  getLikeCountOfBook() {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '(wip) 노래책 좋아요 생성',
    description:
      '특정 노래책에 대한 좋아요를 생성하는 엔드포인트. 존재하지 않는 노래책일 경우 400에러 발생.',
  })
  createLikeOfBook() {}

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '(wip) 노래책 좋아요 삭제',
    description:
      '특정 노래책에 대한 좋아요를 삭제하는 엔드포인트. 존재하지 않는 노래책일 경우 400에러 발생.',
  })
  deleteLikeOfBook() {}

  @UseGuards(JwtAuthGuard)
  @Get(':id/like/me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '(wip) 노래책 좋아요 여부 조회',
    description:
      '특정 노래책에 대한 좋아요 여부를 조회하는 엔드포인트. 존재하지 않는 노래책일 경우 400에러 발생.',
  })
  getMyLikeOfBook() {}
}
