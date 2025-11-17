// dia-api/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersService } from '../users/users.service';
import { LoginDto } from '../users/dto/login.dto';
import { SignupPatientDto } from '../users/dto/signup-patient.dto';
import { PatientProfile } from '../users/patient-profile.entity';
import { UserRole } from '../users/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(PatientProfile)
    private readonly patientRepo: Repository<PatientProfile>,
  ) {}

  async signupPatient(dto: SignupPatientDto) {
    // cria usuário base com papel de paciente
    const user = await this.usersService.create({
      fullName: dto.fullName,
      email: dto.email,
      password: dto.password, // senha em texto aqui, o hash é feito no UsersService
      role: UserRole.PATIENT,
      dateOfBirth: dto.dateOfBirth,
    });

    // cria perfil de paciente
    const profile = this.patientRepo.create({
      user,
      diabetesType: dto.diabetesType,
      treatment: dto.treatment,
      glucoseChecksPerDay: dto.glucoseChecks,
      usesInsulin: !!(dto.bolusInsulin || dto.basalInsulin),
      bolusInsulin: dto.bolusInsulin,
      basalInsulin: dto.basalInsulin,
    });

    await this.patientRepo.save(profile);

    return this.buildToken(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordOk = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordOk) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.buildToken(user.id, user.email, user.role);
  }

  private async buildToken(
    userId: number,
    email: string,
    role: UserRole,
  ): Promise<{
    accessToken: string;
    user: { id: number; email: string; role: UserRole };
  }> {
    const payload = { sub: userId, email, role };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: { id: userId, email, role },
    };
  }
}
