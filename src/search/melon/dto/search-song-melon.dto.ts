import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiResponsePagenationDataDTO } from 'src/common/api-response-data.dto';

export enum SearchSongMelonSortEnum {
  weight = 'weight',
  hit = 'hit',
  date = 'date',
  ganada = 'ganada',
}
export enum SearchSongMelonSectionEnum {
  all = 'all',
  artist = 'artist',
  song = 'song',
  album = 'album',
}

export class SearchSongMelonDTO {
  @IsString()
  @ApiProperty({
    description: '검색 쿼리',
    type: String,
    example: '요아소비',
  })
  q: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    description: '페이지네이션 페이지 번호',
    type: Number,
    default: 1,
    example: 1,
    required: false,
  })
  page?: number;

  @IsEnum(SearchSongMelonSortEnum)
  @IsOptional()
  @ApiProperty({
    description:
      '현재 응답의 item 정렬 방식 (weight: 정확도순, hit: 인기순, date: 최신순, ganada: 가다나순)',
    enum: SearchSongMelonSortEnum,
    default: 1,
    example: 'hit',
    required: false,
  })
  sort?: keyof typeof SearchSongMelonSortEnum;

  @IsEnum(SearchSongMelonSectionEnum)
  @IsOptional()
  @ApiProperty({
    description:
      '현재 응답의 item 검색 범위 (all: 전체검색, song: 노래제목검색, artist: 가수명검색, album: 앨범명검색)',
    enum: SearchSongMelonSectionEnum,
    default: 'all',
    example: 'all',
    required: false,
  })
  section?: keyof typeof SearchSongMelonSectionEnum;
}

class SearchSongMelonResponseMetaDTO {
  @ApiProperty({
    description: '페이지 당 item 개수',
    type: Number,
    default: 50,
    example: 50,
  })
  perPage: 50;
  @ApiProperty({
    description: '현재 응답의 페이지 번호',
    type: Number,
    default: 1,
    example: 1,
  })
  currentPage: number;
  @ApiProperty({
    description:
      '현재 응답의 item 정렬 방식 (weight: 정확도순, hit: 인기순, date: 최신순, ganada: 가다나순)',
    enum: SearchSongMelonSortEnum,
    default: 1,
    example: 'hit',
  })
  sort: keyof typeof SearchSongMelonSortEnum;
  @ApiProperty({
    description: '현재 응답의 페이지 내 item 개수',
    type: Number,
    example: 50,
  })
  pageItemCount: number;
}

class SearchSongMelonResponseDataDTO {
  @ApiProperty({
    description:
      'melon 음원 ID. 실제 melon 음원 ID는 숫자로만 이루어져있지만, 노래책 안에서는 음원의 출처 구분을 위해 "melon_song_" prefix를 붙임. (형식: /^melon_song_[0-9]+$/)',
    type: String,
    example: 'melon_song_12345678',
  })
  id: string;
  @ApiProperty({
    description: 'melon 음원 제목',
    type: String,
    example: '노래제목',
  })
  songTitle: string;
  @ApiProperty({
    description: 'melon 음원 가수명',
    type: String,
    example: '가수명',
  })
  artist: string;
  @ApiProperty({
    description:
      'melon 음원 앨범 정보. 실제 melon 앨범 ID는 숫자로만 이루어져있지만, 노래책 안에서는 앨범의 출처 구분을 위해 "melon_album_" prefix를 붙임. (형식: /^melon_album_[0-9]+$/)',
    example: {
      title: '앨범제목',
      id: 'melon_album_12345678',
    },
  })
  album: {
    title: string;
    id: string;
  };
}

export class SearchSongMelonResponseDTO
  implements
    ApiResponsePagenationDataDTO<
      SearchSongMelonResponseMetaDTO,
      SearchSongMelonResponseDataDTO[]
    >
{
  @ApiProperty({
    description: 'melon 음원 검색 응답의 페이지네이션 관련 정보',
    type: [SearchSongMelonResponseMetaDTO],
  })
  meta: SearchSongMelonResponseMetaDTO;
  @ApiProperty({
    description: 'melon 음원 검색 결과',
    type: [SearchSongMelonResponseDataDTO],
  })
  data: SearchSongMelonResponseDataDTO[];
}
