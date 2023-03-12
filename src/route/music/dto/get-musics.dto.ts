import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiResponsePagenationDataDTO } from 'src/common/api-response/api-response-data.dto';
import { EMusicbookSortMethod } from 'src/common/repository/musicbook/enum';
import { MusicEntity } from 'src/common/repository/musicbook/music.entity';

export class GetMusicsDTO {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    description: '페이지 당 수록곡 아이템 개수',
    type: Number,
    example: 30,
    default: 30,
    nullable: true,
  })
  perPage?: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    description: '페이지 번호',
    type: Number,
    example: 1,
    default: 1,
    nullable: true,
  })
  page?: number;

  @IsString()
  @IsEnum(EMusicbookSortMethod)
  @IsOptional()
  @ApiProperty({
    description:
      '수록곡 목록 정렬 방법 (NEWEST: "최신순", SUGGEST: "추천순", POPULAR: "인기순")',
    enum: EMusicbookSortMethod,
    example: 'NEWEST',
    default: 'NEWEST',
    nullable: true,
  })
  sort?: keyof typeof EMusicbookSortMethod;
}

class GetMusicsResponseMetaDTO {
  @ApiProperty({
    description: '페이지 당 item 개수',
    type: Number,
    example: 30,
  })
  perPage: number;
  @ApiProperty({
    description: '현재 응답의 페이지 번호',
    type: Number,
    example: 1,
  })
  currentPage: number;
  @ApiProperty({
    description:
      '수록곡 목록 정렬 방법 (NEWEST: "최신순", SUGGEST: "추천순", POPULAR: "인기순")',
    enum: EMusicbookSortMethod,
    example: 'NEWEST',
  })
  sort: keyof typeof EMusicbookSortMethod;
  @ApiProperty({
    description: '현재 응답의 페이지 내 item 개수',
    type: Number,
    example: 30,
  })
  pageItemCount: number;
}

export class GetMusicsResponseDTO
  implements
    ApiResponsePagenationDataDTO<GetMusicsResponseMetaDTO, MusicEntity[]>
{
  @ApiProperty({
    description: '수록곡 목록 조회 응답의 페이지네이션 관련 정보',
    type: [GetMusicsResponseMetaDTO],
  })
  meta: GetMusicsResponseMetaDTO;
  @ApiProperty({
    description: '수록곡 목록 조회 결과',
    type: [MusicEntity],
  })
  data: MusicEntity[];
}
