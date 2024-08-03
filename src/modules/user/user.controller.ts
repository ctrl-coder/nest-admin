import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('admin')
  @HttpCode(HttpStatus.OK)
  async admin(_user: UserEntity) {
    return {
      text: `dayday`,
    };
  }
}
