import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';
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
    example: '홍길동',
  })
  displayName?: string;
  @IsUrl()
  @IsOptional()
  @ApiProperty({
    description: '노래책 고유 사용자 프로필 이미지',
    type: String,
    nullable: true,
    example: 'http://example.com/example.png',
  })
  profileImgURL?: string;
  // @IsEmail()
  // @IsOptional()
  // @ApiProperty({
  //   description: '노래책 고유 사용자 이메일',
  //   type: String,
  //   nullable: true,
  //   example: 'example@example.com',
  // })
  // email?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '노래책 고유 사용자 설명',
    type: String,
    nullable: true,
    example: '이것은 설명 텍스트.',
  })
  description?: string;
}
