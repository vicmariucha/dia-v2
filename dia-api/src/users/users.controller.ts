// dia-api/src/users/users.controller.ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOneById(id);

    // remove o hash da senha antes de devolver
    const { passwordHash, ...safeUser } = user as any;
    return safeUser;
  }
}
