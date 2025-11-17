import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { InsulinDose } from './insulin.entity';
import { CreateInsulinDto } from './create-insulin.dto';

@Injectable()
export class InsulinService {
  constructor(
    @InjectRepository(InsulinDose)
    private readonly insulinRepository: Repository<InsulinDose>,
  ) {}

  async create(dto: CreateInsulinDto): Promise<InsulinDose> {
    const entity = this.insulinRepository.create({
      userId: dto.userId,
      units: dto.units,
      type: dto.type,
      appliedAt: new Date(dto.appliedAt),
      notes: dto.notes ?? null,
    });

    return this.insulinRepository.save(entity);
  }

  async findByUser(userId: number, limit = 50): Promise<InsulinDose[]> {
    const options: FindManyOptions<InsulinDose> = {
      where: { userId },
      order: { appliedAt: 'DESC' },
      take: limit,
    };

    return this.insulinRepository.find(options);
  }
}
