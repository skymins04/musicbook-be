import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseDataDTO } from 'src/common/api-response/api-response-data.dto';
import { JwtAuthGuard } from 'src/common/jwt-auth/jwt-auth.guard';
import { Jwt } from 'src/common/jwt-auth/jwt.decorator';
import { PlaylistService } from './playlist.service';
import {
  PlaylistResponseDTO,
  PlaylistUpdateDTO,
  PlaylistWidgetIdDTO,
  PlaylistsResponseDTO,
} from './dto/playlist.dto';

@Controller('widget/playlist')
@ApiTags('Widget - Playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: '본인의 플레이리스트 위젯 목록 조회',
    description:
      '본인의 플레이리스트 위젯 목록을 조회하는 엔드포인트. 노래책이 생성되지 않은 사용자일 경우 400에러 반환.',
  })
  @ApiOkResponse({
    description: '위젯 조회 성공',
    type: PlaylistsResponseDTO,
  })
  async getManyMyWidgetPlaylist(@Jwt() _jwt: MusicbookJwtPayload) {
    return new ApiResponseDataDTO(
      await this.playlistService.getManyMyWidgetPlaylist(_jwt),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: '새 플레이리스트 위젯 생성',
    description:
      '새 플레이리스트 위젯을 생성하는 엔드포인트. 노래책이 생성되지 않은 사용자일 경우 400에러 반환.',
  })
  @ApiOkResponse({
    description: '위젯 생성 성공',
    type: PlaylistResponseDTO,
  })
  async createWidgetPlaylist(@Jwt() _jwt: MusicbookJwtPayload) {
    return new ApiResponseDataDTO(
      await this.playlistService.createWidgetPlaylist(_jwt),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':widgetId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '플레이리스트 위젯 정보 수정',
    description:
      '플레이리스트 위젯의 정보를 수정하는 엔드포인트. 존재하지 않는 위젯 ID일 경우 400에러 반환.',
  })
  async updateWidgetPlaylist(
    @Jwt() _jwt: MusicbookJwtPayload,
    @Param() _param: PlaylistWidgetIdDTO,
    @Body() _body: PlaylistUpdateDTO,
  ) {
    const { widgetId } = _param;
    await this.playlistService.updateWidgetPlaylist(_jwt, widgetId, _body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':widgetId')
  @ApiOperation({
    summary: '플레이리스트 위젯 삭제',
    description:
      '플레이리스트 위젯을 삭제하는 엔드포인트. 존재하지 않는 위젯 ID일 경우 400에러 반환.',
  })
  async deleteWidgetPlaylist(
    @Jwt() _jwt: MusicbookJwtPayload,
    @Param() _param: PlaylistWidgetIdDTO,
  ) {
    const { widgetId } = _param;
    await this.playlistService.deleteWidgetPlaylist(_jwt, widgetId);
  }

  @Get(':widgetId')
  @ApiOperation({
    summary: '특정 플레이리스트 위젯 조회',
    description:
      '특정 플레이리스트 위젯을 조회하는 엔드포인트. 존재하지 않는 위젯 ID일 경우 404에러 반환.',
  })
  @ApiOkResponse({
    description: '위젯 조회 성공',
    type: PlaylistResponseDTO,
  })
  async getOneWidgetPlaylist(@Param() _param: PlaylistWidgetIdDTO) {
    const { widgetId } = _param;
    return new ApiResponseDataDTO(
      await this.playlistService.getOneWidgetPlaylist(widgetId),
    );
  }
}
