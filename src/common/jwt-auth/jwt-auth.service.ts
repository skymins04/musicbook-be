import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

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
}
