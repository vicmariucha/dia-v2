// dia-api/src/meal/meal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from './meal.entity';
import { MealService } from './meal.service';
import { MealController } from './meal.controller';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meal, User])],
  providers: [MealService],
  controllers: [MealController],
})
export class MealModule {}
