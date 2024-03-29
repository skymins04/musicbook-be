import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiResponsePagenationDataDTO } from 'src/common/api-response/api-response-data.dto';
import { BookEntity } from 'src/common/repository/musicbook/book.entity';
import { EMusicbookSortMethod } from 'src/common/repository/musicbook/musicbook.enum';

export class GetBooksDTO {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    description: '페이지 당 노래책 아이템 개수',
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
      '노래책 목록 정렬 방법 (NEWEST: "최신순", SUGGEST: "추천순", POPULAR: "인기순")',
    enum: EMusicbookSortMethod,
    example: 'NEWEST',
    default: 'NEWEST',
    nullable: true,
    required: false,
  })
  sort?: keyof typeof EMusicbookSortMethod;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    description: '노래책 검색 쿼리',
    type: String,
    example: '베타맨',
    nullable: true,
    required: false,
  })
  q?: string;

  @Transform((value) => {
    return value.value === 'true' ? true : false;
  })
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: '팔로우 여부',
    type: Boolean,
    example: false,
    required: false,
  })
  isLiked?: boolean;
}

class GetBooksResponseMetaDTO {
  @ApiProperty({
    description: '페이지 당 item 개수',
    type: Number,
    example: 50,
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
      '노래책 목록 정렬 방법 (NEWEST: "최신순", SUGGEST: "추천순", POPULAR: "인기순")',
    enum: EMusicbookSortMethod,
    example: 'NEWEST',
  })
  sort: keyof typeof EMusicbookSortMethod;
  @ApiProperty({
    description: '현재 응답의 페이지 내 item 개수',
    type: Number,
    example: 50,
  })
  pageItemCount: number;
}

export class GetBooksResponseDTO
  implements
    ApiResponsePagenationDataDTO<GetBooksResponseMetaDTO, BookEntity[]>
{
  @ApiProperty({
    description: '노래책 목록 조회 응답의 페이지네이션 관련 정보',
    type: [GetBooksResponseMetaDTO],
  })
  meta: GetBooksResponseMetaDTO;
  @ApiProperty({
    description: '노래책 목록 조회 결과',
    type: [BookEntity],
  })
  data: BookEntity[];
}
