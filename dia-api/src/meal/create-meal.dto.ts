// dia-api/src/meal/create-meal.dto.ts
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateMealDto {
  @IsInt()
  @IsPositive()
  userId: number;

  @IsString()
  @IsNotEmpty()
  mealType: string;

  @IsNumber()
  @Min(0)
  carbs: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  protein?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fat?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sugar?: number;

  @IsDateString()
  eatenAt: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
