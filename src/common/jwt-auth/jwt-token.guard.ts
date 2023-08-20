import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthService } from './jwt-auth.service';

@Injectable()
export class JwtTokenGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtAuthService: JwtAuthService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    try {
      req.jwt = this.jwtAuthService.getJwtAndVerifyFromReq(req);
      return true;
    } catch (err) {
      return true;
    }
  }
}
