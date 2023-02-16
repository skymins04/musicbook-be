import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

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
  constructor() {
    super({
      jwtFromRequest: ExtractJwtFromCookie('jwt'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<MusicbookJwtPayload> {
    return {
      id: parseInt(payload.id),
      name: payload.name,
      displayName: payload.displayName,
      accessToken: payload.accessToken,
    };
  }
}
