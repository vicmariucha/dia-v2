// dia-api/src/activity/activity.controller.ts
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './create-activity.dto';
import { Activity } from './activity.entity';

@Controller('activity') // -> rota /activity
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  // POST /activity
  @Post()
  create(@Body() dto: CreateActivityDto): Promise<Activity> {
    return this.activityService.create(dto);
  }

  // GET /activity?userId=1&limit=50
  @Get()
  findByUser(
    @Query('userId') userId: string,
    @Query('limit') limit = '50',
  ): Promise<Activity[]> {
    const parsedUserId = Number(userId);
    const parsedLimit = Number(limit) || 50;

    return this.activityService.findByUser(parsedUserId, parsedLimit);
  }
}
