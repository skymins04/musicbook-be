import { Controller, Get, Param, Query } from '@nestjs/common';
import { MelonService } from './melon/melon.service';
import {
  SearchSongMelonDTO,
  SearchSongMelonResponseDTO,
  SearchSongMelonSortEnum,
} from './melon/dto/search-song-melon.dto';
import {
  GetAlbumMelonDTO,
  GetAlbumMelonResponseDTO,
} from './melon/dto/get-album-melon.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  GetSongMelonDTO,
  GetSongMelonResponseDTO,
} from './melon/dto/get-song-melon.dto';
import {
  ApiResponseDataDTO,
  ApiResponsePagenationDataDTO,
} from 'src/common/api-response/api-response-data.dto';

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
    const songTitles = await this.melonService.searchSongByMelon(
      section,
      q,
      page,
      sort,
    );

    return new ApiResponsePagenationDataDTO<{
      sort: keyof typeof SearchSongMelonSortEnum;
    }>(
      {
        perPage: 50,
        currentPage: page,
        sort: sort,
        pageItemCount: songTitles.length,
      },
      songTitles,
    );
  }

  @Get('melon/song/:id')
  @ApiOperation({
    summary: 'melon 음원 조회',
    description: 'melon 음원 조회하는 엔드포인트',
  })
  @ApiOkResponse({
    description: 'melon 음원 조회 성공',
    type: GetSongMelonResponseDTO,
  })
  async getSongMelon(@Param() _param: GetSongMelonDTO) {
    const { id } = _param;
    return new ApiResponseDataDTO(await this.melonService.getMelonSongInfo(id));
  }

  @Get('melon/album/:id')
  @ApiOperation({
    summary: 'melon 앨범 조회',
    description: 'melon 앨범을 조회하는 엔드포인트',
  })
  @ApiOkResponse({
    description: 'melon 앨범 조회 성공',
    type: GetAlbumMelonResponseDTO,
  })
  async getAlbumMelon(@Param() _param: GetAlbumMelonDTO) {
    const { id } = _param;
    return new ApiResponseDataDTO(
      await this.melonService.getMelonAlbumInfo(id),
    );
  }
}
