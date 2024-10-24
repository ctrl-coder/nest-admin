import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { LocalAuthGuard } from '@/guards';
import { PublicRoute } from '@/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 注册
  @PublicRoute()
  @Post('/signup')
  signup(@Body() signupData: UserRegisterDto) {
    return this.authService.signup(signupData);
  }

  // 登录
  @UseGuards(LocalAuthGuard)
  @PublicRoute()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() _loginData: UserLoginDto, @Req() req) {
    return this.authService.login(req.user);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req) {
    return this.authService.logout(req.user);
  }
}
