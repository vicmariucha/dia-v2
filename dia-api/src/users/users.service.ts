// dia-api/src/users/users.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepo.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email já está em uso');
    }

    const user = this.usersRepo.create({
      fullName: dto.fullName,
      email: dto.email,
      // o DTO tem "password", então mapeamos para o campo "passwordHash"
      passwordHash: dto.password,
      role: dto.role,
      dateOfBirth: dto.dateOfBirth,
    });

    return this.usersRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepo.findOne({
      where: { id },
      // 👇 aqui estava o problema: removi "doctorProfile"
      relations: ['patientProfile'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }
}
