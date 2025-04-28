import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/users.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const DEFAULT_MINIMUM_PASSWORD_LENGTH = 6;
const SALT = 10;
const SKIP = 0;
const LIMIT = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    birthDate: Date;
  }): Promise<{ user?: User; errorMessage?: string }> {
    const { name, email, password, birthDate } = data;
    const minimumPasswordLength = DEFAULT_MINIMUM_PASSWORD_LENGTH;
    if (!password || password.length < minimumPasswordLength) {
      return { errorMessage: 'Password should have at least 6 characters' };
    }

    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return {
        errorMessage:
          'Password should have at least one digit/number and one letter.',
      };
    }

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      return {
        errorMessage: 'Account already created using this email.',
      };
    }

    const encryptedPassword = await bcrypt.hash(password, SALT);
    const user = this.usersRepository.create({
      name,
      email,
      birthDate,
      encryptedPassword,
    });

    const savedUser = await this.usersRepository.save(user);
    return { user: savedUser };
  }

  validateToken(authHeader: string): { errorMessage?: string; payload?: any } {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { errorMessage: 'Missing or invalid Authorization header' };
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.AUTH_KEY,
      });
      return { payload };
    } catch (err) {
      return { errorMessage: 'Invalid or expired token' };
    }
  }

  public async getUsersWithPagination(
    limit: number = LIMIT,
    skip: number = SKIP,
  ): Promise<any> {

    const totalUsers = await this.usersRepository.count();
    const users = await this.usersRepository.find({
      skip: skip,
      take: limit,
      order: {
        name: 'ASC',
      }, 
      relations: ['addresses'],
    });

    return {
      users,
      total: totalUsers,
      hasPrevious: skip > 0,
      hasNext: skip + limit < totalUsers,
    };
  }

  public async getUsersWithTokenValidation(
    authHeader: string,
    limit: number = LIMIT,
    skip: number = SKIP,
  ): Promise<any> {
    const validation = this.validateToken(authHeader);
    if (validation.errorMessage) {
      return { errorMessage: validation.errorMessage };
    }

    return this.getUsersWithPagination(limit, skip);
  }

  create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async findAllOrdered(limit: number): Promise<User[]> {
    return this.usersRepository.find({
      take: limit,
      order: {
        name: 'ASC',
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }
}
