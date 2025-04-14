import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Req() req: Request) {
    const { name, email, password, birthDate } = req.body;

    if (!password || password.length < 6) {
      return { error_message: 'Password should have at least 6 characters' };
    }

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
      password,
      birthDate,
    });
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}