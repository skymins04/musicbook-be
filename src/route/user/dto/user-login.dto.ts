import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UserLoginCallbackQueryDTO {
  @IsString()
  @ApiProperty({
    description: 'OAuth callback code',
    type: String,
    example: 'awofhoiawehfoinaocibwebaoiweboinaweaweiofh',
  })
  code: string;

  @IsString()
  @ApiProperty({
    description: 'OAuth callback scope',
    type: String,
    example: 'profile+email',
  })
  scope: string;

  @IsOptional()
  authuser?: number;

  @IsOptional()
  prompt?: string;
}
