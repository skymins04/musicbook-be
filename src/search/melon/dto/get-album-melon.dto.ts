import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { ApiResponseDataDTO } from 'src/common/api-response-data.dto';

export class GetAlbumMelonDTO {
  @IsString()
  @Matches(/^(melon\_album\_)?[0-9]+$/)
  @ApiProperty({
    description: `"/^(melon\_album\_)?[0-9]+$/" 형식에 부합하는 melon 앨범 ID.`,
    type: String,
    example: 'melon_album_12345678',
  })
  albumId: string;
}

class GetAlbumMelonResponseDataDTO {
  @ApiProperty({
    description: `"/^(melon\_album\_)?[0-9]+$/" 형식에 부합하는 melon 앨범 ID.`,
    type: String,
    example: 'melon_album_12345678',
  })
  albumId: string;
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
