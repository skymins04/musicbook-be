import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';
import { ApiResponseDataDTO } from 'src/common/api-response/api-response-data.dto';

export class GetSongMelonDTO {
  @IsNumberString()
  @ApiProperty({
    description: 'melon 음원 ID (numeric string)',
    type: String,
    example: '12345678',
  })
  id: string;
}

export class GetSongMelonResponseDataDTO {
  @ApiProperty({
    description: 'melon 음원 ID (numeric string)',
    type: String,
    example: '12345678',
  })
  songId: string;
  @ApiProperty({
    description: 'melon 음원 제목',
    type: String,
    example: '앨범 제목',
  })
  songTitle: string;
  @ApiProperty({
    description: 'melon 앨범 제목',
    type: String,
    example: '앨범 제목',
  })
  albumTitle: string;
  @ApiProperty({
    description: 'melon 음원 가수명',
    type: String,
    example: '앨범 가수명',
  })
  artistName: string;
  @ApiProperty({
    description: 'melon 음원 장르',
    type: String,
    example: 'J-POP',
  })
  category: string;
  @ApiProperty({
    description: 'melon 음원 발매일 (ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  releasedAt: string;
  @ApiProperty({
    description: 'melon 음원 가수 프로필이미지',
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
  @ApiProperty({
    description: 'melon 음원 가사',
    type: String,
    example: '대충 가사 텍스트.',
  })
  lyrics: string;
}

export class GetSongMelonResponseDTO implements ApiResponseDataDTO {
  @ApiProperty({
    description: 'melon 음원 조회 결과',
    type: GetSongMelonResponseDataDTO,
  })
  data: GetSongMelonResponseDataDTO;
}
