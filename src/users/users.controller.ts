import { Controller, Post, Req, Body } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

const salt = 10;

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Req() req: Request) {
    const { name, email, password, birthDate } = req.body;

    if (!password || password.length < 6) {
      return { error_message: 'Password should have at least 6 characters' };
    }
    const encrypted_password = await bcrypt.hash(password, salt);

    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return {
        error_message:
          'Password should have at least one digit/number and one letter.',
      };
    }

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      return {
        error_message: 'Account already created using this email.',
      };
    }

    const user = await this.usersService.create({
      name,
      email,
      encrypted_password,
      birthDate,
    });
    const { encrypted_password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
@Controller('auth')
export class UserLoginController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async userLogin(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return { error_message: 'Invalid email or password' };
    }

    const isMatch = await bcrypt.compare(password, user.encrypted_password);
    if (!isMatch) {
      return { error_message: 'Invalid email or password' };
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        birthDate: user.birthDate,
      },
      token: 'the_token',
    };
  }
}
