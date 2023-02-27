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

  getTwitchUserInfo(accessToken: string) {
    return axios
      .get('https://api.twitch.tv/helix/users', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Client-ID': process.env.TWITCH_CLIENT_ID,
        },
      })
      .then((res) => {
        console.log(res.data.data[0]);
        return res.data.data[0];
      });
  }

  async loginByTwitch(code: string) {
    const { accessToken, refreshToken } = await this.getTwitchUserToken(code);
    const twitchAPIUserInfo = await this.getTwitchUserInfo(accessToken);
    const userTwitch =
      await this.userRepositoryService.createOrUpdateUserTwitch({
        twitchId: twitchAPIUserInfo.id,
        twitchName: twitchAPIUserInfo.login,
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
        providerId: parseInt(twitchAPIUserInfo.id),
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
        providerId: parseInt(twitchAPIUserInfo.id),
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
