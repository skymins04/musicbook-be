import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  jwtSign(_payload: MusicbookJwtPayload) {
    return this.jwtService.sign(_payload);
  }

  jwtSignAsync(_payload: MusicbookJwtPayload) {
    return this.jwtService.signAsync(_payload);
  }

  jwtVerify(_token: string) {
    return this.jwtService.verify<MusicbookJwtPayload>(_token);
  }

  jwtVerifyAsync(_token: string) {
    return this.jwtService.verifyAsync<MusicbookJwtPayload>(_token);
  }

  getJwtFromReq(_req: Request): string | null {
    const cookieJwt = _req.cookies.jwt || null;
    const authHeaderJwt =
      _req.headers.authorization?.replace('Bearer ', '') || null;
    return cookieJwt || authHeaderJwt || null;
  }

  getJwtAndVerifyFromReq(_req: Request) {
    return this.jwtVerify(this.getJwtFromReq(_req));
  }
}
