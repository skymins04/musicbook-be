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
import { UserLoginCallbackQueryDTO } from './dto/user-login.dto';
import { Request, Response } from 'express';
import { ApiResponseDataDTO } from 'src/common/api-response/api-response-data.dto';
import { JwtAuthGuard } from 'src/common/jwt-auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import axios from 'axios';

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
const GOOGLE_CLIENT_SCOPES = ['openid', 'profile', 'email'].join('+');

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
    @Query() query: UserLoginCallbackQueryDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { code } = query;
    const token = await this.userService.loginByTwitch(code);

    res.cookie('jwt', token, { httpOnly: true });
    return new ApiResponseDataDTO(token);
  }

  @Get('login/google')
  @Redirect(
    `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&redirect_uri=${process.env.API_ADDRESS}/user/login/google/cb&scope=${GOOGLE_CLIENT_SCOPES}&client_id=${process.env.GOOGLE_CLIENT_ID}&service=lso&o2v=2&flowName=GeneralOAuthFlow&prompt=select_account`,
  )
  loginByGoogle() {
    return;
  }

  @Get('login/google/cb')
  async loginByGoogleCallback(
    @Query() query: UserLoginCallbackQueryDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { code } = query;
    await this.userService.loginByGoogle(code);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMeInfo(@Req() req: Request) {
    return new ApiResponseDataDTO(await this.userService.getMeInfo(req));
  }
}

//http://localhost:3000/user/login/google/cb?code=4%2F0AWtgzh553IC0Ed2aexJajR9E8qkXEIhEE9IeBSqjs5u6milMg0A8otrXXD0upa5zoLSSJA&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.readonly+openid&authuser=0&prompt=consent
