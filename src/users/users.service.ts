import { Injectable } from '@nestjs/common';
import { User } from 'src/users/users.entity';
import { UsersDbDatasource } from 'src/users/users.db.datasource';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class UsersService {
  constructor(private usersDbDatasource: UsersDbDatasource) { }

  async create(userData: Partial<User>): Promise<Omit<User, 'password'>> {

    const savedUser = await this.usersDbDatasource.create(userData);

    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersDbDatasource.findAll();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersDbDatasource.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.usersDbDatasource.remove(id);
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }
}

