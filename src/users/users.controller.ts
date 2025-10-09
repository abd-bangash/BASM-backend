import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/database/schemas/user.schema';
import { CreateUserDto } from 'src/database/dto/user.dto';

@Controller('client-users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('create')
  async createUser(@Body() userData: CreateUserDto): Promise<User> {
    return this.userService.create(userData);
  }
}
