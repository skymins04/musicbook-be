import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateBookDTO {
  @IsString()
  @Matches(/^\@[a-z|A-Z|0-9|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|-|_]{1,20}$/)
  @IsOptional()
  @ApiProperty({
    description:
      '노래책 custom ID. 한글, 영어, 숫자, -, _ 조합으로 최소 1자리 ~ 최대 20자리 가능.',
    type: String,
    example: '@베타맨-BetaMan_04',
    nullable: true,
  })
  customId: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z|A-Z|0-9|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|-|_| ]{1,20}$/)
  @ApiProperty({
    description:
      '노래책 제목. 공백만 포함하는 문자열은 허용되지 않음. 한글, 영어, 숫자, -, _, 공백(스페이스바) 조합으로 최소 1자리 ~ 최대 20자리 가능.',
    type: String,
    example: '베타맨의 노래책',
  })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '노래책 설명. 공백 포함 최대 255자까지 입력 가능.',
    type: String,
    example: '이것은 노래책 설명 텍스트.',
    nullable: true,
  })
  description: string;

  @IsString()
  @Matches(/^\![a-z|A-Z|0-9|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|-|_]{1,10}$/)
  @IsOptional()
  @ApiProperty({
    description:
      '노래책 신청곡 명령어 접두사. "!"로 시작하는 한글, 영어, 숫자, -, _ 조합 1~10자리 문자열',
    type: String,
    example: '!노래책',
    default: '!노래책',
    nullable: true,
  })
  requestCommandPrefix: string;

  @ApiProperty({
    description: '노래책 로고 썸네일 이미지 ',
    type: 'string',
    format: 'binary',
  })
  thumnail: Express.Multer.File;

  @ApiProperty({
    description: '노래책 배경 커버 이미지 ',
    type: 'string',
    format: 'binary',
    nullable: true,
    required: false,
  })
  background: Express.Multer.File;
}
