import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { ApiResponseDataDTO } from 'src/common/api-response/api-response-data.dto';
import { MusicEntity } from 'src/common/repository/musicbook/music.entity';

export class MusicIdDTO {
  @IsString()
  @Matches(/^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i)
  @ApiProperty({
    description: '수록곡 ID (uuidv4)',
    type: String,
    example: '12341234-1234-1234-123412341234',
  })
  id: string;
}

export class MusicResponseDTO implements ApiResponseDataDTO {
  @ApiProperty({
    description: '수록곡 생성 결과',
    type: MusicEntity,
  })
  data: MusicEntity;
}

export class MusicsResponseDTO implements ApiResponseDataDTO {
  @ApiProperty({
    description: '수록곡 생성 결과 배열',
    type: [MusicEntity],
  })
  data: MusicEntity[];
}

export class MusicLikeCountResponseDTO implements ApiResponseDataDTO {
  @ApiProperty({
    description: '수록곡 좋아요 개수 결과',
    type: Number,
  })
  data: number;
}

export class MusicLikeStatusResponseDTO implements ApiResponseDataDTO {
  @ApiProperty({
    description: '수록곡 좋아요 여부',
    type: Boolean,
  })
  data: boolean;
}
