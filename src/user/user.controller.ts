import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import * as dotenv from 'dotenv';
import { UserLoginTwitchCallbackQueryDTO } from './dto/user-login.dto';
import { Request, Response } from 'express';
import { ApiResponseDataDTO } from 'src/common/api-response/api-response-data.dto';
import { JwtAuthGuard } from 'src/common/jwt-auth/jwt-auth.guard';

dotenv.config();

const TWITCH_CLIENT_SCOPES = [
  'user:read:follows',
  'user:read:email',
  'user:read:subscriptions',
  'user:read:blocked_users',
  'channel:read:editors',
  'channel:read:vips',
  'moderator:read:followers',
].join('+');

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('jwt', '', { maxAge: 0 });
  }

  @Get('login/twitch')
  @Redirect(
    `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=${process.env.API_ADDRESS}/user/login/twitch/cb&response_type=code&scope=${TWITCH_CLIENT_SCOPES}`,
  )
  loginByTwitch() {
    return;
  }

  @Get('login/twitch/cb')
  async loginByTwitchCallback(
    @Query() query: UserLoginTwitchCallbackQueryDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { code } = query;
    const token = await this.userService.loginByTwitch(code);

    res.cookie('jwt', token, { httpOnly: true });
    return new ApiResponseDataDTO(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMeInfo(@Req() req: Request) {
    return new ApiResponseDataDTO(await this.userService.getMeInfo(req));
  }
}
