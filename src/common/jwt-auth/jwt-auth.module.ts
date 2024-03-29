import { Global, Module } from '@nestjs/common';
import { JwtAuthService } from './jwt-auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthStrategy } from 'src/common/jwt-auth/jwt-auth.strategy';

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '2h' },
      }),
    }),
  ],
  providers: [JwtAuthService, JwtAuthStrategy, JwtService],
  exports: [JwtAuthService, JwtModule],
})
export class JwtAuthModule {}
