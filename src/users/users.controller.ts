import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';

@Controller('users')
export class CreateUser {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Req() req: Request) {
    const body = req.body;
    const userData = {
      name: body.name,
      email: body.email,
      password: body.password,
      birthDate: body.birthDate,
    };
    const user = await this.usersService.create(userData);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
