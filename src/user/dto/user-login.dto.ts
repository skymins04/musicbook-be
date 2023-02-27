import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserLoginCallbackQueryDTO {
  @IsString()
  @ApiProperty({
    description: 'OAuth callback code',
    type: String,
    example: 'awofhoiawehfoinaocibwebaoiweboinaweaweiofh',
  })
  code: string;
}
