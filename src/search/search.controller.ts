import { Controller, Get, Query } from '@nestjs/common';
import { MelonService } from './melon/melon.service';
import {
  SearchSongMelonDTO,
  SearchSongMelonResponseDTO,
} from './melon/dto/search-song-melon.dto';
import {
  GetAlbumMelonDTO,
  GetAlbumMelonResponseDTO,
} from './melon/dto/get-album-melon.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('search')
@ApiTags('Search')
export class SearchController {
  constructor(private readonly melonService: MelonService) {}

  @Get('melon/song')
  @ApiOperation({
    summary: 'melon 음원 검색',
    description: 'melon 음원을 검색하여 리스트로 반환하는 엔드포인트',
  })
  @ApiOkResponse({
    description: 'melon 음원 검색 성공',
    type: SearchSongMelonResponseDTO,
  })
  async searchSongMelon(@Query() _query: SearchSongMelonDTO) {
    const { q, page = 1, sort = 'hit', section = 'all' } = _query;
    return await this.melonService.searchSongByMelon(section, q, page, sort);
  }

  @Get('melon/album')
  @ApiOperation({
    summary: 'melon 앨범 조회',
    description: 'melon 앨범을 조회하는 엔드포인트',
  })
  @ApiOkResponse({
    description: 'melon 음원 조회 성공',
    type: GetAlbumMelonResponseDTO,
  })
  async getAlbumMelon(@Query() _query: GetAlbumMelonDTO) {
    const { albumId } = _query;
    return await this.melonService.getMelonAlbumInfo(albumId);
  }
}
