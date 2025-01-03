import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { PublicRoute, RequirePermission } from '@/decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TransactionInterceptor } from '@/intercepters';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}

  @RequirePermission('system:user:add')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() userDto: CreateUserDto) {
    return await this.userService.create(userDto);
  }

  @Get(':username')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('username') username: string) {
    return await this.userService.findOne(username);
  }

  @Put(':username')
  @UseInterceptors(TransactionInterceptor)
  async update(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(username, updateUserDto);
  }

  // TODO: Delete the unused controller, it's for the `@PublicRoute()` testing
  @PublicRoute()
  @Get('visitor')
  @HttpCode(HttpStatus.OK)
  async visitors(_user: UserEntity, _req: Request) {
    return {
      text: `visitor dayday`,
    };
  }
}
