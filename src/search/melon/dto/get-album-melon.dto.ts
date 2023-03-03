import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { ApiResponseDataDTO } from 'src/common/api-response/api-response-data.dto';

export class GetAlbumMelonDTO {
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({
    description: 'melon 앨범 ID (number)',
    type: Number,
    example: 12345678,
  })
  id: number;
}

export class GetAlbumMelonResponseDataDTO {
  @ApiProperty({
    description: 'melon 앨범 ID (number)',
    type: Number,
    example: 12345678,
  })
  albumId: number;
  @ApiProperty({
    description: 'melon 앨범 제목',
    type: String,
    example: '앨범 제목',
  })
  albumTitle: string;
  @ApiProperty({
    description: 'melon 앨범 가수명',
    type: String,
    example: '앨범 가수명',
  })
  artistName: string;
  @ApiProperty({
    description: 'melon 앨범 가수 프로필이미지',
    type: String,
    example: 'https://example.com/thumbnail.jpg',
  })
  artistThumbnail: string;
  @ApiProperty({
    description:
      'melon 앨범 자켓이미지 (1000: 1000*1000px, 500: 500*500px, 200: 200*200px)',
    example: {
      '1000': 'https://example.com/thumbnail.jpg',
      '500': 'https://example.com/thumbnail.jpg',
      '200': 'https://example.com/thumbnail.jpg',
    },
  })
  thumbnail: {
    '1000': string;
    '500': string;
    '200': string;
  };
}

export class GetAlbumMelonResponseDTO implements ApiResponseDataDTO {
  @ApiProperty({
    description: 'melon 앨범 조회 결과',
    type: GetAlbumMelonResponseDataDTO,
  })
  data: GetAlbumMelonResponseDataDTO;
}
