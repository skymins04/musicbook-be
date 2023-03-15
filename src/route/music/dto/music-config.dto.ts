import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiResponseDataDTO } from 'src/common/api-response/api-response-data.dto';

export class MusicConfigDTO {
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: '수록곡 숨김여부',
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
    description: '수록곡 모든 신청곡 유료화 여부',
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
    description: '수록곡 신청곡 허용 여부',
    type: Boolean,
    example: false,
    nullable: true,
    required: false,
  })
  isAllowRequest?: boolean;
}

export class MusicConfigReponseDataDTO {
  @ApiProperty({
    description: '수록곡 숨김여부',
    type: Boolean,
    example: false,
  })
  isHide: boolean;
  @ApiProperty({
    description: '수록곡 모든 신청곡 유료화 여부',
    type: Boolean,
    example: false,
  })
  isPaid: boolean;
  @ApiProperty({
    description: '수록곡 신청곡 허용 여부',
    type: Boolean,
    example: false,
  })
  isAllowRequest: boolean;
}

export class MusicConfigReponseDTO implements ApiResponseDataDTO {
  @ApiProperty({
    description: '수록곡 설정 정보',
    type: MusicConfigReponseDataDTO,
  })
  data: MusicConfigReponseDataDTO;
}
