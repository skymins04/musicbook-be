import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';
import { ApiResponsePagenationDataDTO } from 'src/common/api-response/api-response-data.dto';
import { EMusicbookSortMethod } from 'src/common/repository/musicbook/musicbook.enum';
import { MusicEntity } from 'src/common/repository/musicbook/music.entity';

export class GetMusicsPagenationDTO {
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
    required: false,
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
    required: false,
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
    required: false,
  })
  sort?: keyof typeof EMusicbookSortMethod;

  @IsString()
  @IsNotEmpty()
  @Matches(/[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣-_ ]+/)
  @IsOptional()
  @ApiProperty({
    description: '수록곡 카테고리',
    type: String,
    example: 'J-POP',
    nullable: true,
    required: false,
  })
  category?: string;
}

export class GetMusicsDTO extends GetMusicsPagenationDTO {
  @IsString()
  @Matches(/^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i)
  @IsOptional()
  @ApiProperty({
    description: '노래책 ID (uuidv4)',
    type: String,
    example: '12341234-1234-1234-1234-123412341234',
    nullable: true,
    required: false,
  })
  bookId?: string;
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
