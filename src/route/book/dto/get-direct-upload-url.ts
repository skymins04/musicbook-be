import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDataDTO } from 'src/common/api-response/api-response-data.dto';

export class CloudflareImagesDirectURLDataDTO {
  @ApiProperty({
    description: 'Cloudflare images direct upload uuid',
    type: String,
    example: 'af835ac9-958e-4c31-14f3-72d971cdfb00',
  })
  id: string;

  @ApiProperty({
    description: 'Cloudflare images direct upload url',
    type: String,
    example: 'https://example.com',
  })
  uploadURL: string;
}

export class GetURLsForBookImgDirectUploadingResponseDataDTO {
  @ApiProperty({
    description: '노래책 썸네일 이미지 Cloudflare Direct upload data',
    type: CloudflareImagesDirectURLDataDTO,
  })
  thumbnail: CloudflareImagesDirectURLDataDTO;
  @ApiProperty({
    description: '노래책 배경 이미지 Cloudflare Direct upload data',
    type: CloudflareImagesDirectURLDataDTO,
  })
  background: CloudflareImagesDirectURLDataDTO;
}

export class GetURLsForBookImgDirectUploadingResponseDTO
  implements ApiResponseDataDTO
{
  @ApiProperty({
    description: '응답 정보',
    type: GetURLsForBookImgDirectUploadingResponseDataDTO,
  })
  data: GetURLsForBookImgDirectUploadingResponseDataDTO;
}
