// dia-api/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GlucoseModule } from './glucose/glucose.module';
import { User } from './users/user.entity';
import { PatientProfile } from './users/patient-profile.entity';
import { DoctorProfile } from './users/doctor-profile.entity';
import { GlucoseMeasurement } from './glucose/glucose.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'diauser',
      password: process.env.DB_PASS || 'diapass',
      database: process.env.DB_NAME || 'dia',
      entities: [User, PatientProfile, DoctorProfile, GlucoseMeasurement],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    GlucoseModule,
  ],
})
export class AppModule {}
