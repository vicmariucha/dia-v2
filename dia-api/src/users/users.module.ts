// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { User } from './user.entity';
import { PatientProfile } from './patient-profile.entity';
import { DoctorProfile } from './doctor-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, PatientProfile, DoctorProfile])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // <-- para o AuthModule conseguir injetar
})
export class UsersModule {}
