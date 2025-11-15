// dia-api/src/glucose/glucose.service.ts
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GlucoseMeasurement } from './glucose.entity';
import { CreateGlucoseDto } from './dto/create-glucose.dto';
import { User } from '../users/user.entity';

@Injectable()
export class GlucoseService {
  constructor(
    @InjectRepository(GlucoseMeasurement)
    private readonly glucoseRepo: Repository<GlucoseMeasurement>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async createForUser(
    userId: number,
    dto: CreateGlucoseDto,
  ): Promise<GlucoseMeasurement> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const measurement = this.glucoseRepo.create({
      value: dto.value,
      measuredAt: new Date(dto.measuredAt),
      period: dto.period,
      notes: dto.notes,
      patient: user,
    });

    return this.glucoseRepo.save(measurement);
  }

  async findAllForUser(userId: number): Promise<GlucoseMeasurement[]> {
    return this.glucoseRepo.find({
      where: { patient: { id: userId } },
      order: { measuredAt: 'DESC' },
    });
  }
}
