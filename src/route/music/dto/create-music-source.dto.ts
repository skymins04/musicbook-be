import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateOriginalSourceDTO {
  @IsString()
  @ApiProperty({
    description: '노래제목',
    type: String,
    example: '노래제목',
  })
  title: string;

  @IsString()
  @ApiProperty({
    description: '원곡자명',
    type: String,
    example: '원곡자명',
  })
  artistName: string;

  @ApiProperty({
    description: '원곡자 프로필 이미지 cloudflare images uuid',
    type: String,
    format: 'binary',
    example: '2cdc28f0-017a-49c4-9ed7-87056c83901',
    nullable: true,
    required: false,
  })
  artistThumbnail?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣-_ ]{1,10}$/)
  @ApiProperty({
    description: '카테고리(한글, 영어, 숫자, 공백, -, _ 조합 10자리)',
    type: String,
    example: '카테고리',
  })
  category: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '앨범명',
    type: String,
    example: '앨범명',
    nullable: true,
    required: false,
  })
  albumTitle?: string;

  @ApiProperty({
    description: '앨범 썸네일 이미지 cloudflare images uuid',
    type: String,
    format: 'binary',
    example: '2cdc28f0-017a-49c4-9ed7-87056c83901',
    nullable: true,
    required: false,
  })
  albumThumbnail?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '가사',
    type: String,
    example: '가사',
    nullable: true,
    required: false,
  })
  lyrics?: string;
}

export class CreateMelonSourceDTO {
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({
    description: 'melon 음원 ID (number)',
    type: Number,
    example: 12345,
  })
  id: number;
}
