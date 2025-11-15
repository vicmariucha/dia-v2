// dia-api/src/glucose/glucose.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlucoseService } from './glucose.service';
import { GlucoseController } from './glucose.controller';
import { GlucoseMeasurement } from './glucose.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GlucoseMeasurement, User])],
  controllers: [GlucoseController],
  providers: [GlucoseService],
  exports: [GlucoseService],
})
export class GlucoseModule {}
