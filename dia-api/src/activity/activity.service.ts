// dia-api/src/activity/activity.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Activity } from './activity.entity';
import { CreateActivityDto } from './create-activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async create(dto: CreateActivityDto): Promise<Activity> {
    const entity = this.activityRepository.create({
      userId: dto.userId,
      activityType: dto.activityType,
      durationMinutes: dto.durationMinutes,
      intensity: dto.intensity ?? undefined,
      calories: dto.calories ?? null,
      performedAt: new Date(dto.performedAt),
      notes: dto.notes ?? null,
    });

    return this.activityRepository.save(entity);
  }

  async findByUser(userId: number, limit = 50): Promise<Activity[]> {
    const options: FindManyOptions<Activity> = {
      where: { userId },
      order: { performedAt: 'DESC' },
      take: limit,
    };

    return this.activityRepository.find(options);
  }
}
