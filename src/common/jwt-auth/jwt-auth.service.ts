import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  jwtSign(payload: MusicbookJwtPayload) {
    return this.jwtService.sign(payload);
  }

  jwtSignAsync(payload: MusicbookJwtPayload) {
    return this.jwtService.signAsync(payload);
  }

  jwtVerify(token: string) {
    return this.jwtService.verify<MusicbookJwtPayload>(token);
  }

  jwtVerifyAsync(token: string) {
    return this.jwtService.verifyAsync<MusicbookJwtPayload>(token);
  }

  getJwtFromReq(req: Request): string | null {
    const cookieJwt = req.cookies.jwt || null;
    const authHeaderJwt =
      req.headers.authorization?.replace('Bearer ', '') || null;
    return cookieJwt || authHeaderJwt || null;
  }
}
