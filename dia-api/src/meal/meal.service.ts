// dia-api/src/meal/meal.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Meal } from './meal.entity';
import { CreateMealDto } from './create-meal.dto';

@Injectable()
export class MealService {
  constructor(
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>,
  ) {}

  async create(dto: CreateMealDto): Promise<Meal> {
    const entity = this.mealRepository.create({
      userId: dto.userId,
      mealType: dto.mealType,
      carbs: dto.carbs,
      protein: dto.protein ?? null,
      fat: dto.fat ?? null,
      sugar: dto.sugar ?? null,
      eatenAt: new Date(dto.eatenAt),
      notes: dto.notes ?? null,
    });

    return this.mealRepository.save(entity);
  }

  async findByUser(userId: number, limit = 50): Promise<Meal[]> {
    const options: FindManyOptions<Meal> = {
      where: { userId },
      order: { eatenAt: 'DESC' },
      take: limit,
    };

    return this.mealRepository.find(options);
  }
}
