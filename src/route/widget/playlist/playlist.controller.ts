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

@Controller('widget/playlist')
@ApiTags('Widget - Playlist')
export class PlaylistController {
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: '(wip) 본인의 플레이리스트 위젯 목록 조회',
    description:
      '본인의 플레이리스트 위젯 목록을 조회하는 엔드포인트. 노래책이 생성되지 않은 사용자일 경우 400에러 반환.',
  })
  getManyMyWidgetPlaylist() {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: '(wip) 새 플레이리스트 위젯 생성',
    description:
      '새 플레이리스트 위젯을 생성하는 엔드포인트. 노래책이 생성되지 않은 사용자일 경우 400에러 반환.',
  })
  createWidgetPlaylist() {}

  @UseGuards(JwtAuthGuard)
  @Patch(':widgetId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '(wip) 플레이리스트 위젯 정보 수정',
    description:
      '플레이리스트 위젯의 정보를 수정하는 엔드포인트. 존재하지 않는 위젯 ID일 경우 400에러 반환.',
  })
  updateWidgetPlaylist() {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':widgetId')
  @ApiOperation({
    summary: '(wip) 플레이리스트 위젯 삭제',
    description:
      '플레이리스트 위젯을 삭제하는 엔드포인트. 존재하지 않는 위젯 ID일 경우 400에러 반환.',
  })
  deleteWidgetPlaylist() {}

  @Get(':widgetId')
  @ApiOperation({
    summary: '(wip) 특정 플레이리스트 위젯 조회',
    description:
      '특정 플레이리스트 위젯을 조회하는 엔드포인트. 존재하지 않는 위젯 ID일 경우 404에러 반환.',
  })
  getOneMyWidgetPlaylist() {}
}
