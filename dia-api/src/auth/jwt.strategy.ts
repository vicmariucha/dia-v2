// dia-api/src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

type JwtPayload = {
  sub: number;
  email: string;
  role: 'PATIENT' | 'DOCTOR';
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // TEM que ser o mesmo secret usado no AuthService pra assinar o token
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default_jwt_secret',
    });
  }

  async validate(payload: JwtPayload) {
    // O que retornar aqui vira req.user nos controllers protegidos
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
