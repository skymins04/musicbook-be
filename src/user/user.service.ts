import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { Request } from 'express';
import { JwtAuthService } from 'src/common/jwt-auth/jwt-auth.service';
import { UserRepositoryService } from 'src/common/repository/user/user-repository.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepositoryService: UserRepositoryService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  getTwitchUserToken(
    code: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return axios
      .post(
        'https://id.twitch.tv/oauth2/token',
        {
          client_id: process.env.TWITCH_CLIENT_ID,
          client_secret: process.env.TWITCH_CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
          redirect_uri: `${process.env.API_ADDRESS}/user/login/twitch/cb`,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then((res) => res.data)
      .then((res) => ({
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
      }));
  }

  getTwitchUserInfo(token: string) {
    return axios
      .get('https://api.twitch.tv/helix/users', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Client-ID': process.env.TWITCH_CLIENT_ID,
        },
      })
      .then((res) => ({
        ...res.data.data[0],
      }));
  }

  getGoogleUserToken(code: string): Promise<string> {
    return axios
      .post(`https://oauth2.googleapis.com/token`, {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.API_ADDRESS}/user/login/google/cb`,
        grant_type: 'authorization_code',
      })
      .then((res) => res.data.id_token);
  }

  getGoogleUserInfo(token: string): Promise<{
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    email: string;
    email_verified: boolean;
    at_hash: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    locale: string;
    iat: string;
    exp: string;
    alg: string;
    kid: string;
    typ: string;
  }> {
    return axios
      .get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
      .then((res) => ({
        ...res.data,
        email_verified: res.data.email_verified === 'true',
      }));
  }

  async loginByTwitch(code: string) {
    const { accessToken, refreshToken } = await this.getTwitchUserToken(code);
    const twitchAPIUserInfo = await this.getTwitchUserInfo(accessToken);
    const userTwitch = await this.userRepositoryService.createOrUpdateTwitch({
      twitchId: twitchAPIUserInfo.id,
      twitchLogin: twitchAPIUserInfo.login,
      twitchDisplayName: twitchAPIUserInfo.display_name,
      twitchDescription: twitchAPIUserInfo.description,
      twitchProfileImgURL: twitchAPIUserInfo.profile_image_url,
      twitchOfflineImgURL: twitchAPIUserInfo.offline_image_url,
      twitchEmail: twitchAPIUserInfo.email,
      twitchCreatedAt: twitchAPIUserInfo.created_at,
      twitchType: twitchAPIUserInfo.type,
      twitchBroadcasterType: twitchAPIUserInfo.broadcaster_type,
      twitchAccessToken: accessToken,
      twitchRefreshToken: refreshToken,
    });
    const existingUser =
      await this.userRepositoryService.findOneUserByTwitchEntity(
        userTwitch,
        true,
      );

    if (existingUser) {
      existingUser.deletedAt = null;
      await existingUser.save();
      return this.jwtAuthService.jwtSign({
        id: existingUser.id,
        displayName: existingUser.displayName,
        accessToken,
        provider: 'twitch',
        providerId: twitchAPIUserInfo.id,
      });
    } else {
      const user = await this.userRepositoryService.createUserByTwitch(
        userTwitch,
      );
      return this.jwtAuthService.jwtSign({
        id: user.id,
        displayName: user.displayName,
        accessToken,
        provider: 'twitch',
        providerId: twitchAPIUserInfo.id,
      });
    }
  }

  async loginByGoogle(code: string) {
    const token = await this.getGoogleUserToken(code);
    const googleAPIUserInfo = await this.getGoogleUserInfo(token);
    const userGoogle = await this.userRepositoryService.createOrUpdateGoogle({
      googleId: googleAPIUserInfo.sub,
      googleDisplayName: googleAPIUserInfo.name,
      googleProfileImgURL: googleAPIUserInfo.picture,
      googleEmail: googleAPIUserInfo.email,
    });
    const existingUser =
      await this.userRepositoryService.findOneUserByGoogleEntity(
        userGoogle,
        true,
      );

    if (existingUser) {
      existingUser.deletedAt = null;
      await existingUser.save();
      return this.jwtAuthService.jwtSign({
        id: existingUser.id,
        displayName: existingUser.displayName,
        accessToken: '',
        provider: 'google',
        providerId: googleAPIUserInfo.sub,
      });
    } else {
      const user = await this.userRepositoryService.createUserByGoogle(
        userGoogle,
      );
      return this.jwtAuthService.jwtSign({
        id: user.id,
        displayName: user.displayName,
        accessToken: '',
        provider: 'google',
        providerId: googleAPIUserInfo.sub,
      });
    }
  }

  async getMeInfo(req: Request) {
    try {
      const jwt = this.jwtAuthService.jwtVerify(
        this.jwtAuthService.getJwtFromReq(req),
      );
      const user = await this.userRepositoryService.findOneUserById(
        jwt.id,
        false,
      );
      if (user) return user;
      throw new BadRequestException('not found user');
    } catch (e) {
      throw new BadRequestException('invaild authentication');
    }
  }
}
