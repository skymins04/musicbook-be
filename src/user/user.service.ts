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

  async loginByTwitch(code: string) {
    const { access_token, refresh_token } = await axios
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
      .then((res) => res.data);

    const twitchAPIUserInfo = await axios
      .get('https://api.twitch.tv/helix/users', {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Client-ID': process.env.TWITCH_CLIENT_ID,
        },
      })
      .then((res) => res.data);

    const userTwitch =
      await this.userRepositoryService.createOrUpdateUserTwitch({
        twitchId: twitchAPIUserInfo.data[0].id,
        twitchName: twitchAPIUserInfo.data[0].login,
        twitchDisplayName: twitchAPIUserInfo.data[0].display_name,
        twitchDescription: twitchAPIUserInfo.data[0].description,
        twitchProfileImgURL: twitchAPIUserInfo.data[0].profile_image_url,
        twitchOfflineImgURL: twitchAPIUserInfo.data[0].offline_image_url,
        twitchEmail: twitchAPIUserInfo.data[0].email,
        twitchCreatedAt: twitchAPIUserInfo.data[0].created_at,
        twitchType: twitchAPIUserInfo.data[0].type,
        twitchBroadcasterType: twitchAPIUserInfo.data[0].broadcaster_type,
        twitchAccessToken: access_token,
        twitchRefreshToken: refresh_token,
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
        accessToken: access_token,
        provider: 'twitch',
        providerId: parseInt(twitchAPIUserInfo.data[0].id),
      });
    } else {
      const user = await this.userRepositoryService.createUserByTwitch(
        userTwitch,
      );
      return this.jwtAuthService.jwtSign({
        id: user.id,
        displayName: user.displayName,
        accessToken: access_token,
        provider: 'twitch',
        providerId: parseInt(twitchAPIUserInfo.data[0].id),
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
