import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Redirect,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserLoginCallbackQueryDTO } from './dto/user-login.dto';
import { Response } from 'express';
import { ApiResponseDataDTO } from 'src/common/api-response/api-response-data.dto';
import { JwtAuthGuard } from 'src/common/jwt-auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserMeResponseDTO, UserMeUpdateDTO } from './dto/user-me.dto';
import { UserLinkaCallbackResponseDTO } from './dto/user-link.dto';
import { Jwt } from 'src/common/jwt-auth/jwt.decorator';
import { ImgFilesInterceptor } from 'src/common/cloudflare-multer/image-files.interceptor';
import { getCloudflareImagesFileURL } from 'src/common/cloudflare-multer/getCloudflareFileURL';

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
  logout(@Res({ passthrough: true }) _res: Response) {
    _res.cookie('jwt', '', { maxAge: 0 });
  }

  @Get('login/twitch')
  @ApiOperation({
    summary: '트위치를 통한 사용자 로그인',
    description: `트위치를 통한 사용자 로그인 jwt를 생성하고 쿠키 "jwt"로 전달하는 엔드포인트. 등록된 적 없는 사용자일 경우 새로 생성 후 jwt를 발급한다.`,
  })
  loginByTwitch(@Res({ passthrough: true }) _res: Response) {
    _res.redirect(
      `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=${process.env.API_ADDRESS}/user/login/twitch/cb&response_type=code&scope=${TWITCH_CLIENT_SCOPES}`,
    );
  }

  @Get('login/twitch/cb')
  @ApiOperation({
    summary: '트위치를 통한 사용자 로그인 oauth callback',
    description: '트위치를 통한 사용자 로그인 oauth callback',
  })
  async loginByTwitchCallback(
    @Query() _query: UserLoginCallbackQueryDTO,
    @Res({ passthrough: true }) _res: Response,
  ) {
    const { code } = _query;
    const token = await this.userService.loginByTwitchCallback(code);

    _res.cookie('jwt', token, { httpOnly: true });
    return new ApiResponseDataDTO(token);
  }

  @Get('login/google')
  @ApiOperation({
    summary: '구글을 통한 사용자 로그인',
    description: `구글을 통한 사용자 로그인 jwt를 생성하고 쿠키 "jwt"로 전달하는 엔드포인트. 등록된 적 없는 사용자일 경우 새로 생성 후 jwt를 발급한다.`,
  })
  loginByGoogle(@Res({ passthrough: true }) _res: Response) {
    _res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&redirect_uri=${process.env.API_ADDRESS}/user/login/google/cb&scope=${GOOGLE_CLIENT_SCOPES}&client_id=${process.env.GOOGLE_CLIENT_ID}&service=lso&o2v=2&flowName=GeneralOAuthFlow&prompt=select_account`,
    );
  }

  @Get('login/google/cb')
  @ApiOperation({
    summary: '구글을 통한 사용자 로그인 oauth callback',
    description: '구글을 통한 사용자 로그인 oauth callback',
  })
  async loginByGoogleCallback(
    @Query() _query: UserLoginCallbackQueryDTO,
    @Res({ passthrough: true }) _res: Response,
  ) {
    const { code } = _query;
    const token = await this.userService.loginByGoogleCallback(code);

    _res.cookie('jwt', token, { httpOnly: true });
    return new ApiResponseDataDTO(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '사용자 본인의 정보 획득',
    description: `쿠키 "jwt" 또는 Authentication Header Bearer token를 통해 사용자 본인의 정보를 획득하는 엔드포인트.`,
  })
  @ApiOkResponse({
    description: '조회 성공',
    type: UserMeResponseDTO,
  })
  async getMeInfo(@Jwt() _jwt: MusicbookJwtPayload) {
    return new ApiResponseDataDTO(await this.userService.getMeInfo(_jwt));
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ImgFilesInterceptor(['profileImg']))
  @Patch('me')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '사용자 본인의 정보 업데이트',
    description: `사용자 본인의 정보를 업데이트하는 엔드포인트.`,
  })
  async updateMeInfo(
    @Jwt() _jwt: MusicbookJwtPayload,
    @UploadedFiles() _files: MulterFiles<'profileImg'>,
    @Body() _body: UserMeUpdateDTO,
  ) {
    await this.userService.updateMeInfo(_jwt, {
      ..._body,
      profileImg:
        _files.profileImg &&
        getCloudflareImagesFileURL(_files.profileImg[0].filename),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/link/twitch')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '트위치 계정 사용자 연동',
    description:
      '트위치 계정을 노래책 사용자에 연동하는 엔드포인트. 트위치 OAuth 페이지로 리다이렉트 후, /user/link/twitch/cb로 콜백됨.',
  })
  async linkTwitchToUser(@Res({ passthrough: true }) _res: Response) {
    _res.redirect(
      `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=${process.env.API_ADDRESS}/user/link/twitch/cb&response_type=code&scope=${TWITCH_CLIENT_SCOPES}&force_verify=true`,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/link/twitch/cb')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '트위치 계정 사용자 연동 oauth callback',
    description:
      '트위치 계정 사용자 연동 oauth callback. response 내의 "code"를 100초 이내에 POST /user/link/twitch의 "code" 파라미터로 전달하면 트위치 계정 연동이 적용됨. 100초 이후 캐시가 만료되어 400에러 발생.',
  })
  @ApiOkResponse({
    description: 'OAuth 인증 성공',
    type: UserLinkaCallbackResponseDTO,
  })
  async linkTwitchToUserCallback(@Query() _query: UserLoginCallbackQueryDTO) {
    const { code } = _query;
    return new ApiResponseDataDTO(
      await this.userService.linkTwitchToUserCallback(code),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/link/twitch')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '트위치 계정 사용자 연동 적용',
    description:
      'GET /user/link/twitch를 통해 발급된 code를 전달하면 트위치 계정 사용자 연동이 적용되는 엔드포인트',
  })
  async linkTwitchToUserApply(
    @Jwt() _jwt: MusicbookJwtPayload,
    @Query() _query: UserLoginCallbackQueryDTO,
  ) {
    const { code } = _query;
    await this.userService.linkTwitchToUserApply(_jwt, code);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/link/twitch')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '트위치 계정 사용자 연동 해제',
    description: '트위치 계정 사용자 연동 해제',
  })
  async unlinkTwitchToUser(@Jwt() _jwt: MusicbookJwtPayload) {
    await this.userService.unlinkTwitchToUser(_jwt);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/link/google')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '구글 계정 사용자 연동',
    description:
      '구글 계정을 노래책 사용자에 연동하는 엔드포인트. 구글 OAuth 페이지로 리다이렉트 후, /user/link/google/cb로 콜백됨.',
  })
  async linkGoogleToUser(@Res({ passthrough: true }) _res: Response) {
    _res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&redirect_uri=${process.env.API_ADDRESS}/user/link/google/cb&scope=${GOOGLE_CLIENT_SCOPES}&client_id=${process.env.GOOGLE_CLIENT_ID}&service=lso&o2v=2&flowName=GeneralOAuthFlow&prompt=select_account`,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/link/google/cb')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '구글 계정 사용자 연동 oauth callback',
    description:
      '구글 계정 사용자 연동 oauth callback. response 내의 "code"를 100초 이내에 POST /user/link/twitch의 "code" 파라미터로 전달하면 구글 계정 연동이 적용됨. 100초 이후 캐시가 만료되어 400에러 발생.',
  })
  @ApiOkResponse({
    description: 'OAuth 인증 성공',
    type: UserLinkaCallbackResponseDTO,
  })
  async linkGoogleToUserCallback(@Query() _query: UserLoginCallbackQueryDTO) {
    const { code } = _query;
    return new ApiResponseDataDTO(
      await this.userService.linkGoogleToUserCallback(code),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/link/google')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '구글 계정 사용자 연동 적용',
    description:
      'GET /user/link/google을 통해 발급된 code를 전달하면 구글 계정 사용자 연동이 적용되는 엔드포인트',
  })
  async linkGoogleToUserApply(
    @Jwt() _jwt: MusicbookJwtPayload,
    @Query() _query: UserLoginCallbackQueryDTO,
  ) {
    const { code } = _query;
    await this.userService.linkGoogleToUserApply(_jwt, code);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/link/google')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '구글 계정 사용자 연동 해제',
    description: '구글 계정 사용자 연동 해제',
  })
  async unlinkGoogleToUser(@Jwt() _jwt: MusicbookJwtPayload) {
    await this.userService.unlinkGoogleToUser(_jwt);
  }
}
