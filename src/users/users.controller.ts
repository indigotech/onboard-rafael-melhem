import { Controller, Post, Req, Body } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const DEFAULT_MINIMUM_PASSWORD_LENGTH = 6;
const WEEK_HOURS = '168h';
const SALT = 10;
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  async create(@Req() req: Request) {
    const minimumPasswordLength = DEFAULT_MINIMUM_PASSWORD_LENGTH;
    const salt = SALT;
    const { name, email, password, birthDate } = req.body;
    if (!password || password.length < minimumPasswordLength) {
      return { errorMessage: 'Password should have at least 6 characters' };
    }

    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return {
        errorMessage:
          'Password should have at least one digit/number and one letter.',
      };
    }

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      return {
        errorMessage: 'Account already created using this email.',
      };
    }
    const encryptedPassword = await bcrypt.hash(password, salt);
    const user = await this.usersService.create({
      name,
      email,
      encryptedPassword,
      birthDate,
    });
    const { encryptedPassword: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}
@Controller('auth')
export class UserLoginController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  async userLogin(
    @Body() body: { email: string; password: string; rememberMe: boolean },
  ) {
    const weekHours = WEEK_HOURS;
    const { email, password, rememberMe } = body;
    const signOption = rememberMe ? { expiresIn: weekHours } : undefined;
    const token = this.jwtService.sign(body, signOption);

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return { errorMessage: 'Invalid email or password' };
    }

    const isMatch = await bcrypt.compare(password, user.encryptedPassword);
    if (!isMatch) {
      return { errorMessage: 'Invalid email or password' };
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        birthDate: user.birthDate,
      },
      token: token,
      expiresIn: rememberMe ? weekHours : null,
    };
  }
}
