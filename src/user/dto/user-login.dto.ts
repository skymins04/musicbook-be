import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ApiResponseDataDTO } from 'src/common/api-response/api-response-data.dto';
import { UserEntity } from 'src/common/repository/user/user.entity';

export class UserLoginCallbackQueryDTO {
  @IsString()
  @ApiProperty({
    description: 'OAuth callback code',
    type: String,
    example: 'awofhoiawehfoinaocibwebaoiweboinaweaweiofh',
  })
  code: string;
}

export class UserMeResponseDTO implements ApiResponseDataDTO {
  @ApiProperty({
    description: '사용자 정보',
    type: UserEntity,
  })
  data: UserEntity;
}
