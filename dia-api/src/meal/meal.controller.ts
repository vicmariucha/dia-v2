// dia-api/src/meal/meal.controller.ts
import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { MealService } from './meal.service';
import { CreateMealDto } from './create-meal.dto';
import { Meal } from './meal.entity';

@Controller('meals')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Post()
  create(@Body() dto: CreateMealDto): Promise<Meal> {
    return this.mealService.create(dto);
  }

  // GET /meals?userId=1&limit=50
  @Get()
  findByUser(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('limit') limit = '50',
  ): Promise<Meal[]> {
    const parsedLimit = Number(limit) || 50;
    return this.mealService.findByUser(userId, parsedLimit);
  }
}
