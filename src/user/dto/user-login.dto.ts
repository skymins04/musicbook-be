import { IsString } from 'class-validator';

export class UserLoginTwitchCallbackQueryDTO {
  @IsString()
  code: string;
}
