import { IsString } from 'class-validator';

export class UserLoginCallbackQueryDTO {
  @IsString()
  code: string;
}
