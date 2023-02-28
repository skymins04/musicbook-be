import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ApiResponseDataDTO } from 'src/common/api-response/api-response-data.dto';

export class UserLinkableQueryDTO {
  @IsString()
  @ApiProperty({
    description: 'id',
    type: String,
    example: '12345678',
  })
  id: string;
}

enum EUserLinkableResponse {
  notFound = 'notFound',
  notLinkable = 'notLinkable',
  linkable = 'linkable',
  assigned = 'assigned',
}

export class UserLinkableResponseDTO implements ApiResponseDataDTO {
  @IsString()
  @ApiProperty({
    description: '사용자 계정 연동 가능 여부',
    enum: EUserLinkableResponse,
    example: 'linkable',
  })
  data: keyof typeof EUserLinkableResponse;
}
