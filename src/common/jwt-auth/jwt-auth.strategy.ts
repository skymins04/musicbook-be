import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../repository/user/user.repository';

const ExtractJwtFromAuthHeader = ExtractJwt.fromAuthHeaderAsBearerToken();

const ExtractJwtFromCookie = (cookie_name: string) => (request: Request) => {
  let token = ExtractJwtFromAuthHeader(request);
  if (token) {
    delete request.cookies[cookie_name];
  } else if (request.cookies && request.cookies[cookie_name]) {
    token = request.cookies[cookie_name] as string;
  }
  return token;
};

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwtFromCookie('jwt'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<MusicbookJwtPayload | boolean> {
    if (
      !(await this.userRepository.findOneUserById(payload.id, {
        withDeleted: false,
        withJoin: false,
      }))
    )
      return false;
    return {
      id: payload.id,
      displayName: payload.displayName,
      accessToken: payload.accessToken,
      provider: payload.provider,
      providerId: payload.providerId,
    };
  }
}
