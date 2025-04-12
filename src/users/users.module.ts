import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { CreateUser } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule],
  controllers: [CreateUser],
  providers: [UsersService],
})
export class UsersModule { }
