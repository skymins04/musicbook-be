import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthService } from './jwt-auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtAuthService: JwtAuthService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    try {
      req.jwt = this.jwtAuthService.getJwtAndVerifyFromReq(req);
      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
