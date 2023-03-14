import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  ValidateIf,
} from 'class-validator';
import {
  EMusicMRType,
  EMusicPreviewType,
  EMusicSourceType,
} from 'src/common/repository/musicbook/musicbook.enum';

export class CreateMusicDTO {
  @IsEnum(EMusicSourceType)
  @ApiProperty({
    description:
      '수록곡 source type ("MELON": melon 음원, "ORIGINAL": 고유 음원)',
    enum: EMusicSourceType,
    example: 'MELON',
  })
  type: keyof typeof EMusicSourceType;

  @ValidateIf((o: CreateMusicDTO) => o.type === 'MELON')
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({
    description:
      'melon 음원 ID (number, type이 "MELON"일때만 이 프로퍼티를 이용)',
    type: Number,
    nullable: true,
    example: 12345,
  })
  sourceMelonId: number;

  @ValidateIf((o: CreateMusicDTO) => o.type === 'ORIGINAL')
  @IsString()
  @ApiProperty({
    description:
      '고유 음원 ID (uuidv4), type이 "ORIGINAL"일때만 이 프로퍼티를 이용)',
    type: String,
    nullable: true,
    example: '12341234-1234-1234-1234-123412341234',
  })
  sourceOriginalId: string;

  @IsString()
  @Length(1, 50)
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    description:
      '수록곡 제목 (최대 50자, 이 프로퍼티를 이용하지 않는 경우 source의 제목을 사용하게 됨)',
    type: String,
    nullable: true,
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
    example: 'https://example.com',
    maxLength: 255,
  })
  previewURL?: string;

  @IsEnum(EMusicPreviewType)
  @IsOptional()
  @ApiProperty({
    description:
      '(*현재 유튜브만 지원) 수록곡 미리보기 URL type ("YOUTUBE": 유튜브 영상, "SOUNDCLOUD": 사운드클라우드, "SPOTIFY": 스포티파이, "FLAC": FLAC 오디오 파일, "WAV": WAV 오디오 파일, "MP3": MP3 오디오 파일)',
    enum: EMusicPreviewType,
    nullable: true,
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
    example: 'https://example.com',
    maxLength: 255,
  })
  mrURL?: string;

  @IsEnum(EMusicMRType)
  @IsOptional()
  @ApiProperty({
    description:
      '(*현재 유튜브만 지원) 수록곡 MR URL type ("YOUTUBE": 유튜브 영상, "SOUNDCLOUD": 사운드클라우드, "SPOTIFY": 스포티파이, "FLAC": FLAC 오디오 파일, "WAV": WAV 오디오 파일, "MP3": MP3 오디오 파일)',
    enum: EMusicMRType,
    nullable: true,
    example: 'YOUTUBE',
  })
  mrType?: keyof typeof EMusicMRType;
}