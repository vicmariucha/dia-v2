import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PatientProfile } from '../users/patient-profile.entity';

const EXPIRES_IN_SECONDS = parseInt(process.env.JWT_EXPIRES_IN ?? '86400', 10); 
// 86400 = 24h

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([PatientProfile]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: {
        // aqui agora é número (segundos), então o TS para de reclamar
        expiresIn: EXPIRES_IN_SECONDS,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
