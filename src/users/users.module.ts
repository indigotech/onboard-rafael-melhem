import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { UserAddress } from 'src/users/user-address.entity'
import {
  UsersController,
  UserLoginController,
} from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [TypeOrmModule.forFeature([User, UserAddress]), AuthModule],
  exports: [TypeOrmModule],
  controllers: [UsersController, UserLoginController],

  providers: [UsersService],
})
export class UsersModule {}
