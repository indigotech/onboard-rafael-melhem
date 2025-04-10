import { Controller, Post, Req, Body } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


const salt = 10;
@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}


  @Post()
  async create(@Req() req: Request) {
    const { name, email, password, birthDate } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Authorization header:', authHeader);
      return { error_message: 'Missing or invalid Authorization header' };
    }

    const token = authHeader.replace('Bearer ', '');

    let payload;
    try {
      payload = this.jwtService.verify(token);
    } catch (err) {
      return { error_message: 'Invalid or expired token' };
    }

    if (!payload.email || !payload.password) {
      return { error_message: 'Invalid token payload' };
    }

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
    const encrypted_password = await bcrypt.hash(password, salt);
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
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  async userLogin(
    @Body() body: { email: string; password: string; rememberMe: boolean },
  ) {
    const { email, password, rememberMe } = body;
    const signOption = rememberMe ? { expiresIn: '168h' } : undefined;
    const token = this.jwtService.sign(body, signOption);


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
      token: token,
      expiresIn: rememberMe ? '168h' : null,
    };

  }
}
