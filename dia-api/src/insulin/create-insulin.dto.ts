import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { InsulinType } from './insulin.entity';

export class CreateInsulinDto {
  @IsInt()
  @IsPositive()
  userId: number;

  @IsInt()
  @IsPositive()
  units: number;

  @IsEnum(InsulinType)
  type: InsulinType;

  @IsDateString()
  appliedAt: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
