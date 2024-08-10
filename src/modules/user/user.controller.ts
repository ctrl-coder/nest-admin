import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { PublicRoute } from '@/decorators';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('admin')
  @HttpCode(HttpStatus.OK)
  async admin(_user: UserEntity, _req: Request) {
    return {
      text: `admin dayday`,
    };
  }

  @PublicRoute()
  @Get('visitor')
  @HttpCode(HttpStatus.OK)
  async visitors(_user: UserEntity, _req: Request) {
    return {
      text: `visitor dayday`,
    };
  }
}
