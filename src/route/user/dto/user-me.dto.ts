import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ApiResponseDataDTO } from 'src/common/api-response/api-response-data.dto';
import { UserEntity } from 'src/common/repository/user/user.entity';

export class UserMeResponseDTO implements ApiResponseDataDTO {
  @ApiProperty({
    description: '사용자 정보',
    type: UserEntity,
  })
  data: UserEntity;
}

export class UserMeUpdateDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '노래책 고유 사용자 이름',
    type: String,
    nullable: true,
    required: false,
    example: '홍길동',
  })
  displayName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '노래책 고유 사용자 설명',
    type: String,
    nullable: true,
    required: false,
    example: '이것은 설명 텍스트.',
  })
  description?: string;

  @ApiProperty({
    description: '노래책 고유 사용자 프로필 이미지',
    type: String,
    format: 'binary',
    nullable: true,
    required: false,
  })
  profileImg?: string;
}
