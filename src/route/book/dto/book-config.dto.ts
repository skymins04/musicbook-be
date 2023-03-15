import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiResponseDataDTO } from 'src/common/api-response/api-response-data.dto';

export class BookConfigDTO {
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: '노래책 숨김여부',
    type: Boolean,
    example: false,
    nullable: true,
    required: false,
  })
  isHide?: boolean;
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: '노래책 모든 신청곡 유료화 여부',
    type: Boolean,
    example: false,
    nullable: true,
    required: false,
  })
  isPaid?: boolean;
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: '노래책 신청곡 대기열 내 중복 허용 여부',
    type: Boolean,
    example: false,
    nullable: true,
    required: false,
  })
  isAllowDuplicateRequest?: boolean;
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: '노래책 신청곡 허용 여부',
    type: Boolean,
    example: false,
    nullable: true,
    required: false,
  })
  isAllowRequest?: boolean;
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: '노래책 신청곡 대기열 개수 제한 허용 여부',
    type: Boolean,
    example: false,
    nullable: true,
    required: false,
  })
  isAllowRequestLimit?: boolean;
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: '노래책 신청곡 대기열 최대 개수',
    type: Boolean,
    example: false,
    nullable: true,
    required: false,
  })
  requestLimitCount?: number;
}

export class BookConfigReponseDataDTO {
  @ApiProperty({
    description: '노래책 숨김여부',
    type: Boolean,
    example: false,
  })
  isHide: boolean;
  @ApiProperty({
    description: '노래책 모든 신청곡 유료화 여부',
    type: Boolean,
    example: false,
  })
  isPaid: boolean;
  @ApiProperty({
    description: '노래책 신청곡 대기열 내 중복 허용 여부',
    type: Boolean,
    example: false,
  })
  isAllowDuplicateRequest: boolean;
  @ApiProperty({
    description: '노래책 신청곡 허용 여부',
    type: Boolean,
    example: false,
  })
  isAllowRequest: boolean;
  @ApiProperty({
    description: '노래책 신청곡 대기열 개수 제한 허용 여부',
    type: Boolean,
    example: false,
  })
  isAllowRequestLimit: boolean;
  @ApiProperty({
    description: '노래책 신청곡 대기열 최대 개수',
    type: Boolean,
    example: false,
  })
  requestLimitCount: number;
}

export class BookConfigReponseDTO implements ApiResponseDataDTO {
  @ApiProperty({
    description: '노래책 설정 정보',
    type: BookConfigReponseDataDTO,
  })
  data: BookConfigReponseDataDTO;
}
