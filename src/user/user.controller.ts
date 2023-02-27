import {
  Controller,
  Get,
  Query,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import * as dotenv from 'dotenv';
import {
  UserLoginCallbackQueryDTO,
  UserMeResponseDTO,
} from './dto/user-login.dto';
import { Request, Response } from 'express';
import { ApiResponseDataDTO } from 'src/common/api-response/api-response-data.dto';
import { JwtAuthGuard } from 'src/common/jwt-auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

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
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('logout')
  @ApiOperation({
    summary: '사용자 로그아웃',
    description: `쿠키 "jwt"를 제거하여 사용자를 로그아웃시키는 엔드포인트`,
  })
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('jwt', '', { maxAge: 0 });
  }

  @Get('login/twitch')
  @ApiOperation({
    summary: '트위치를 통한 사용자 로그인',
    description: `트위치를 통한 사용자 로그인 jwt를 생성하고 쿠키 "jwt"로 전달하는 엔드포인트. 등록된 적 없는 사용자일 경우 새로 생성 후 jwt를 발급한다.`,
  })
  @Redirect(
    `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=${process.env.API_ADDRESS}/user/login/twitch/cb&response_type=code&scope=${TWITCH_CLIENT_SCOPES}`,
  )
  loginByTwitch() {
    return;
  }

  @Get('login/twitch/cb')
  @ApiOperation({
    summary: '트위치를 통한 사용자 로그인 oauth callback',
    description: '트위치를 통한 사용자 로그인 oauth callback',
  })
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
  @ApiOperation({
    summary: '구글을 통한 사용자 로그인',
    description: `구글을 통한 사용자 로그인 jwt를 생성하고 쿠키 "jwt"로 전달하는 엔드포인트. 등록된 적 없는 사용자일 경우 새로 생성 후 jwt를 발급한다.`,
  })
  @Redirect(
    `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&redirect_uri=${process.env.API_ADDRESS}/user/login/google/cb&scope=${GOOGLE_CLIENT_SCOPES}&client_id=${process.env.GOOGLE_CLIENT_ID}&service=lso&o2v=2&flowName=GeneralOAuthFlow&prompt=select_account`,
  )
  loginByGoogle() {
    return;
  }

  @Get('login/google/cb')
  @ApiOperation({
    summary: '구글을 통한 사용자 로그인 oauth callback',
    description: '구글을 통한 사용자 로그인 oauth callback',
  })
  async loginByGoogleCallback(
    @Query() query: UserLoginCallbackQueryDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { code } = query;
    const token = await this.userService.loginByGoogle(code);

    res.cookie('jwt', token, { httpOnly: true });
    return new ApiResponseDataDTO(token);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '사용자 본인의 정보 획득',
    description: `쿠키 "jwt" 또는 Authentication Header Bearer token를 통해 사용자 본인의 정보를 획득하는 엔드포인트.`,
  })
  @ApiOkResponse({
    description: '조회 성공',
    type: UserMeResponseDTO,
  })
  @Get('me')
  async getMeInfo(@Req() req: Request) {
    return new ApiResponseDataDTO(await this.userService.getMeInfo(req));
  }
}
