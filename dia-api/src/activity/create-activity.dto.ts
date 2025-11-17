// dia-api/src/activity/create-activity.dto.ts
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

export class CreateActivityDto {
  @IsInt()
  @IsPositive()
  userId: number;

  @IsString()
  @IsNotEmpty()
  activityType: string;

  @IsInt()
  @Min(1)
  durationMinutes: number;

  @IsOptional()
  @IsString()
  intensity?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  calories?: number;

  @IsDateString()
  performedAt: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
