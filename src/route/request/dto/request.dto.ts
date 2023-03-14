import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, Matches } from 'class-validator';
import { ApiResponseDataDTO } from 'src/common/api-response/api-response-data.dto';
import { SongRequestBlacklistEntity } from 'src/common/repository/song-request/song-request-blacklist.entity';
import { SongRequestEntity } from 'src/common/repository/song-request/song-request.entity';

export class RequestIdDTO {
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({
    description: '신청곡 ID (number)',
    type: Number,
    example: 12345,
  })
  requestId: number;
}

export class RequestMusicIdDTO {
  @IsString()
  @Matches(/^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i)
  @ApiProperty({
    description: '수록곡 ID (uuidv4)',
    type: String,
    example: '12341234-1234-1234-1234-123412341234',
  })
  musicId: string;
}

export class RequestBookIdDTO {
  @IsString()
  @Matches(/^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i)
  @ApiProperty({
    description: '노래책 ID (uuidv4)',
    type: String,
    example: '12341234-1234-1234-1234-123412341234',
  })
  bookId: string;
}

export class RequestUserIdDTO {
  @IsString()
  @Matches(/^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i)
  @ApiProperty({
    description: '노래책 사용자 ID (uuidv4)',
    type: String,
    example: '12341234-1234-1234-1234-123412341234',
  })
  userId: string;
}

export class RequestResponseDTO implements ApiResponseDataDTO {
  @ApiProperty({
    description: '신청곡 목록',
    type: [SongRequestEntity],
  })
  data: SongRequestEntity[];
}

export class RequestBlacklistResponseDTO implements ApiResponseDataDTO {
  @ApiProperty({
    description: '신청곡 목록',
    type: [SongRequestBlacklistEntity],
  })
  data: SongRequestBlacklistEntity[];
}
