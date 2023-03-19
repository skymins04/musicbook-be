import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import {
  EMusicMRType,
  EMusicPreviewType,
} from 'src/common/repository/musicbook/musicbook.enum';

export class UpdateMyMusicDTO {
  @IsString()
  @Length(1, 50)
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    description:
      '수록곡 제목 (최대 50자, 이 프로퍼티를 이용하지 않는 경우 source의 제목을 사용하게 됨)',
    type: String,
    nullable: true,
    required: false,
    example: '수록곡 제목',
    maxLength: 50,
  })
  title?: string;

  @IsString()
  @Length(0, 255)
  @IsOptional()
  @ApiProperty({
    description: '수록곡 설명글 (최대 255자)',
    type: String,
    nullable: true,
    required: false,
    example: '수록곡 설명글',
    maxLength: 255,
  })
  description?: string;

  @IsUrl()
  @Length(1, 255)
  @IsOptional()
  @ApiProperty({
    description: '수록곡 미리보기 URL (최대 255자)',
    type: String,
    nullable: true,
    required: false,
    example: 'https://example.com',
    maxLength: 255,
  })
  previewURL?: string;

  @ApiProperty({
    description: '수록곡 미리보기 파일 URL',
    type: String,
    format: 'binary',
    nullable: true,
    required: false,
    example: 'https://example.com',
    maxLength: 255,
  })
  previewFile?: Express.Multer.File;

  @IsEnum(EMusicPreviewType)
  @IsOptional()
  @ApiProperty({
    description:
      '수록곡 미리보기 URL type ("YOUTUBE": 유튜브 영상, "SOUNDCLOUD": 사운드클라우드, "SPOTIFY": 스포티파이, "FLAC": FLAC 오디오 파일, "WAV": WAV 오디오 파일, "MP3": MP3 오디오 파일)',
    enum: EMusicPreviewType,
    nullable: true,
    required: false,
    example: 'YOUTUBE',
  })
  previewType?: keyof typeof EMusicPreviewType;

  @IsString()
  @Length(1, 255)
  @IsOptional()
  @ApiProperty({
    description: '수록곡 MR URL (최대 255자)',
    type: String,
    nullable: true,
    required: false,
    example: 'https://example.com',
    maxLength: 255,
  })
  mrURL?: string;

  @ApiProperty({
    description: '수록곡 파일 MR URL',
    type: String,
    format: 'binary',
    nullable: true,
    required: false,
    example: 'https://example.com',
    maxLength: 255,
  })
  mrFile?: Express.Multer.File;

  @IsEnum(EMusicMRType)
  @IsOptional()
  @ApiProperty({
    description:
      '수록곡 MR URL type ("YOUTUBE": 유튜브 영상, "SOUNDCLOUD": 사운드클라우드, "SPOTIFY": 스포티파이, "FLAC": FLAC 오디오 파일, "WAV": WAV 오디오 파일, "MP3": MP3 오디오 파일)',
    enum: EMusicMRType,
    nullable: true,
    required: false,
    example: 'YOUTUBE',
  })
  mrType?: keyof typeof EMusicMRType;
}
