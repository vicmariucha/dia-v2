// dia-api/src/glucose/glucose.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { GlucoseService } from './glucose.service';
import { CreateGlucoseDto } from './dto/create-glucose.dto';

@Controller('glucose')
export class GlucoseController {
  constructor(private readonly glucoseService: GlucoseService) {}

  @Post(':userId')
  create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: CreateGlucoseDto,
  ) {
    return this.glucoseService.createForUser(userId, dto);
  }

  @Get(':userId')
  findAll(@Param('userId', ParseIntPipe) userId: number) {
    return this.glucoseService.findAllForUser(userId);
  }
}
