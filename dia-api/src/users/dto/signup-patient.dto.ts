import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignupPatientDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  // data de nascimento (opcional)
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  // tipo de diabetes (tipo 1, tipo 2, gestacional etc.)
  @IsString()
  @IsNotEmpty()
  diabetesType: string;

  // tratamento principal (insulina, medicamento oral etc.)
  @IsString()
  @IsNotEmpty()
  treatment: string;

  // quantas medições por dia (texto livre por enquanto)
  @IsOptional()
  @IsString()
  glucoseChecks?: string;

  // se usar insulina, quais (opcionais)
  @IsOptional()
  @IsString()
  bolusInsulin?: string;

  @IsOptional()
  @IsString()
  basalInsulin?: string;
}
