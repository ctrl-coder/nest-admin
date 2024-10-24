import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { PublicRoute } from '@/decorators';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() userDto: CreateUserDto) {
    return await this.userService.create(userDto);
  }

  @Get(':username')
  @HttpCode(HttpStatus.CREATED)
  async findOne(@Param() { username }: { username: string }) {
    return await this.userService.findOne(username);
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
