import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { InsulinService } from './insulin.service';
import { CreateInsulinDto } from './create-insulin.dto';
import { InsulinDose } from './insulin.entity';

@Controller('insulin')
export class InsulinController {
  constructor(private readonly insulinService: InsulinService) {}

  @Post()
  create(@Body() dto: CreateInsulinDto): Promise<InsulinDose> {
    return this.insulinService.create(dto);
  }

  // GET /insulin?userId=1&limit=50
  @Get()
  findByUser(
    @Query('userId') userId: string,
    @Query('limit') limit = '50',
  ): Promise<InsulinDose[]> {
    const parsedUserId = Number(userId);
    const parsedLimit = Number(limit) || 50;

    return this.insulinService.findByUser(parsedUserId, parsedLimit);
  }
}
