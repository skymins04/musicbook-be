import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDataDTO } from 'src/common/api-response/api-response-data.dto';
import { UserEntity } from 'src/common/repository/user/user.entity';

export class UserMeResponseDTO implements ApiResponseDataDTO {
  @ApiProperty({
    description: '사용자 정보',
    type: UserEntity,
  })
  data: UserEntity;
}
