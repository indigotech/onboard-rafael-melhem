import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() userData: any) {
    const user = await this.usersService.create(userData);
    return user;
  }
}