import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
<<<<<<< HEAD
import { User } from 'src/users/users.entity';
import {
  UsersController,
  UserLoginController,
} from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { AuthModule } from 'src/auth/auth.module';
=======
import { User } from './users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

>>>>>>> b3b8513 (Setup database input validation)
@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  exports: [TypeOrmModule],
<<<<<<< HEAD
  controllers: [UsersController, UserLoginController],

=======
  controllers: [UsersController],
>>>>>>> b3b8513 (Setup database input validation)
  providers: [UsersService],
})
export class UsersModule {}
