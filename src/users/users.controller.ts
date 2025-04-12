import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('users')
export class CreateUser {
  @Post()
  create(@Req() req: Request) {
    const body = req.body;
    const userData = {
      id: 1,
      name: body.name,
      email: body.email,
      birthDate: body.birthDate,
    };
    return userData;
  }
}
