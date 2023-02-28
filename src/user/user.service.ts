import { InjectRedis } from '@nestjs-modules/ioredis';
import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { Request } from 'express';
import { Redis } from 'ioredis';
import { JwtAuthService } from 'src/common/jwt-auth/jwt-auth.service';
import { UserRepositoryService } from 'src/common/repository/user/user-repository.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepositoryService: UserRepositoryService,
    private readonly jwtAuthService: JwtAuthService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  getTwitchUserToken(
    _code: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return axios
      .post(
        'https://id.twitch.tv/oauth2/token',
        {
          client_id: process.env.TWITCH_CLIENT_ID,
          client_secret: process.env.TWITCH_CLIENT_SECRET,
          code: _code,
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

  getTwitchUserInfo(_token: string) {
    return axios
      .get('https://api.twitch.tv/helix/users', {
        headers: {
          Authorization: `Bearer ${_token}`,
          'Client-ID': process.env.TWITCH_CLIENT_ID,
        },
      })
      .then((res) => ({
        ...res.data.data[0],
      }));
  }

  getGoogleUserToken(_code: string): Promise<string> {
    return axios
      .post(`https://oauth2.googleapis.com/token`, {
        code: _code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.API_ADDRESS}/user/login/google/cb`,
        grant_type: 'authorization_code',
      })
      .then((res) => res.data.id_token);
  }

  getGoogleUserInfo(_token: string): Promise<{
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
      .get(`https://oauth2.googleapis.com/tokeninfo?id_token=${_token}`)
      .then((res) => ({
        ...res.data,
        email_verified: res.data.email_verified === 'true',
      }));
  }

  async loginByTwitchCallback(_code: string) {
    const { accessToken, refreshToken } = await this.getTwitchUserToken(_code);
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
    const existingUserByTwitchId =
      await this.userRepositoryService.findOneUserByTwitchId(
        userTwitch.twitchId,
        true,
      );
    const existingUserByEmail =
      await this.userRepositoryService.findOneUserByEmail(
        userTwitch.twitchEmail,
        true,
      );
    const existingUser = existingUserByTwitchId || existingUserByEmail;

    if (existingUser) {
      existingUser.deletedAt = null;
      existingUser.twitch = userTwitch;
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

  async loginByGoogleCallback(_code: string) {
    const token = await this.getGoogleUserToken(_code);
    const googleAPIUserInfo = await this.getGoogleUserInfo(token);
    const userGoogle = await this.userRepositoryService.createOrUpdateGoogle({
      googleId: googleAPIUserInfo.sub,
      googleDisplayName: googleAPIUserInfo.name,
      googleProfileImgURL: googleAPIUserInfo.picture,
      googleEmail: googleAPIUserInfo.email,
    });
    const existingUserByGoogleId =
      await this.userRepositoryService.findOneUserByGoogleId(
        userGoogle.googleId,
        true,
      );
    const existingUserByEmail =
      await this.userRepositoryService.findOneUserByEmail(
        userGoogle.googleEmail,
        true,
      );
    const existingUser = existingUserByGoogleId || existingUserByEmail;

    if (existingUser) {
      existingUser.deletedAt = null;
      existingUser.google = userGoogle;
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

  async getMeInfo(_jwt: MusicbookJwtPayload) {
    try {
      const user = await this.userRepositoryService.findOneUserById(
        _jwt.id,
        false,
      );
      if (user) return user;
      throw new BadRequestException('not found user');
    } catch (e) {
      throw new BadRequestException('invaild authentication');
    }
  }

  async getLinkableTwitchToUser(
    _twitchId: string,
  ): Promise<'notFound' | 'notLinkable' | 'linkable' | 'assigned'> {
    const userTwitch = await this.userRepositoryService.findOneTwitchById(
      _twitchId,
      true,
    );
    const existingUser = await this.userRepositoryService.findOneUserByTwitchId(
      _twitchId,
      true,
    );
    if (!userTwitch) return 'notFound';
    if (existingUser && existingUser.google === null) return 'notLinkable';
    if (existingUser) return 'assigned';
    return 'linkable';
  }

  async getLinkableGoogleToUser(
    _googleId: string,
  ): Promise<'notFound' | 'notLinkable' | 'linkable' | 'assigned'> {
    const userGoogle = await this.userRepositoryService.findOneGoogleById(
      _googleId,
      true,
    );
    const existingUser = await this.userRepositoryService.findOneUserByGoogleId(
      _googleId,
      true,
    );
    if (!userGoogle) return 'notFound';
    if (existingUser && existingUser.twitch === null) return 'notLinkable';
    if (existingUser) return 'assigned';
    return 'linkable';
  }

  async linkTwitchToUser(_twitchId: string, _userId: string) {
    const userTwitch = await this.userRepositoryService.findOneTwitchById(
      _twitchId,
      true,
    );
    const existingUser = await this.userRepositoryService.findOneUserByTwitchId(
      _twitchId,
      true,
    );
    const targetUser = await this.userRepositoryService.findOneUserById(
      _userId,
      false,
    );
    if (!userTwitch || !targetUser) throw new BadRequestException();

    if (existingUser) {
      existingUser.twitch = null;
      if (existingUser.google === null) await existingUser.remove();
      else await existingUser.save();
    }

    targetUser.twitch = userTwitch;
    await targetUser.save();
  }

  async linkTwitchToUserCallback(_code: string) {
    const { accessToken, refreshToken } = await this.getTwitchUserToken(_code);
    const twitchAPIUserInfo = await this.getTwitchUserInfo(accessToken);
    const linkable = await this.getLinkableTwitchToUser(twitchAPIUserInfo.id);

    await this.redis.set(
      _code,
      JSON.stringify({ ...twitchAPIUserInfo, accessToken, refreshToken }),
    );
    await this.redis.expire(_code, 100);

    return {
      linkable,
      code: _code,
    };
  }

  async linkTwitchToUserApply(_jwt: MusicbookJwtPayload, _code: string) {
    const stringifiedTwitchAPIUserInfo = await this.redis.get(_code);
    if (!stringifiedTwitchAPIUserInfo)
      throw new BadRequestException('invaild request or expired request');
    else await this.redis.del(_code);

    const twitchAPIUserInfo = JSON.parse(stringifiedTwitchAPIUserInfo);
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
      twitchAccessToken: twitchAPIUserInfo.accessToken,
      twitchRefreshToken: twitchAPIUserInfo.refreshToken,
    });

    await this.linkTwitchToUser(userTwitch.twitchId, _jwt.id);
  }

  async linkGoogleToUser(_googleId: string, _userId: string) {
    const userGoogle = await this.userRepositoryService.findOneGoogleById(
      _googleId,
      true,
    );
    const existingUser = await this.userRepositoryService.findOneUserByGoogleId(
      _googleId,
      true,
    );
    const targetUser = await this.userRepositoryService.findOneUserById(
      _userId,
      false,
    );
    if (!userGoogle || !targetUser) throw new BadRequestException();

    existingUser.google = null;
    if (existingUser.twitch === null) await existingUser.remove();
    else await existingUser.save();

    targetUser.google = userGoogle;
    await targetUser.save();
  }

  async linkGoogleToUserCallback(_code: string) {
    const token = await this.getGoogleUserToken(_code);
    const googleAPIUserInfo = await this.getGoogleUserInfo(token);
    const linkable = await this.getLinkableGoogleToUser(googleAPIUserInfo.sub);

    await this.redis.set(_code, JSON.stringify({ ...googleAPIUserInfo }));
    await this.redis.expire(_code, 100);

    return {
      linkable,
      code: _code,
    };
  }

  async linkGoogleToUserApply(_jwt: MusicbookJwtPayload, _code: string) {
    const stringifiedTwitchAPIUserInfo = await this.redis.get(_code);
    if (!stringifiedTwitchAPIUserInfo)
      throw new BadRequestException('invaild request or expired request');
    else await this.redis.del(_code);

    const googleAPIUserInfo = JSON.parse(stringifiedTwitchAPIUserInfo);
    const userGoogle = await this.userRepositoryService.createOrUpdateGoogle({
      googleId: googleAPIUserInfo.sub,
      googleDisplayName: googleAPIUserInfo.name,
      googleProfileImgURL: googleAPIUserInfo.picture,
      googleEmail: googleAPIUserInfo.email,
    });

    await this.linkGoogleToUser(userGoogle.googleId, _jwt.id);
  }

  async unlinkTwitchToUser(_jwt: MusicbookJwtPayload) {
    const user = await this.userRepositoryService.findOneUserById(
      _jwt.id,
      false,
    );
    if (user.google !== null) {
      user.twitch = null;
      await user.save();
    } else throw new BadRequestException();
  }

  async unlinkGoogleToUser(_jwt: MusicbookJwtPayload) {
    const user = await this.userRepositoryService.findOneUserById(
      _jwt.id,
      false,
    );
    if (user.twitch !== null) {
      user.google = null;
      await user.save();
    } else throw new BadRequestException();
  }
}
