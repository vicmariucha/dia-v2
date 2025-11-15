// dia-api/src/glucose/dto/create-glucose.dto.ts
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateGlucoseDto {
  @IsInt()
  value: number; // valor da glicemia

  @IsDateString()
  measuredAt: string; // data/hora em ISO (ex: 2025-11-15T12:30:00Z)

  @IsString()
  @IsNotEmpty()
  period: string; // ex: "Antes do café", "Depois do almoço"

  @IsString()
  @IsOptional()
  notes?: string;
}
