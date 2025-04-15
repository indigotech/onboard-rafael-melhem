import { Controller, Post, Req, Body, Query, Get } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

const WEEK_HOURS = '168h';

@Controller('users')
export class UsersController {
  private readonly salt: number; 
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService) { 
      this.salt = Number(this.configService.get<number>('SALT'))
    }


  @Get()
  async findAll(@Req() req: Request, @Query('limit') limit?: string) {
    const authHeader = req.headers.authorization;
    return this.usersService.getUsersWithTokenValidation(authHeader, limit);
  }

  @Post()
  async create(@Req() req: Request) {
    const { name, email, password, birthDate } = req.body;

    const result = await this.usersService.createUser({
      name,
      email,
      password,
      birthDate,
    });

    if (result.errorMessage) {
      return { errorMessage: result.errorMessage };
    }

    const { encryptedPassword: _, ...userWithoutPassword } = result.user!;
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
