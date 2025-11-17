// src/insulin/insulin.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsulinDose } from './insulin.entity';
import { InsulinService } from './insulin.service';
import { InsulinController } from './insulin.controller';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InsulinDose, User])],
  providers: [InsulinService],
  controllers: [InsulinController],
})
export class InsulinModule {}
