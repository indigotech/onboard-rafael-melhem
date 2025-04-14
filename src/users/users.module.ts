import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/users.entity';
import {
  UsersController,
  UserLoginController,
} from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { UsersDbDatasource } from 'src/users/users.db.datasource';


@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  exports: [TypeOrmModule],
  controllers: [UsersController],
  providers: [UsersService, UsersDbDatasource],
})
export class UsersModule { }
