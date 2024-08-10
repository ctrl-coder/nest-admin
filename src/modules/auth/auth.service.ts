import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { UserRegisterDto } from './dto/user-register.dto';
import { jwtConfigs } from '@/constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly user: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async getUser(user: UserEntity) {
    return this.user.findOneBy({ username: user.username });
  }

  async login(user: Partial<UserEntity>) {
    const payload = { username: user.username, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConfigs.secret,
    });
    return {
      access_token: accessToken,
    };
  }

  async signup(signupData: UserRegisterDto) {
    const findUser = await this.user.findOne({
      where: { username: signupData.username },
    });
    if (findUser && findUser.username === signupData.username) {
      throw new BadRequestException('用户已经存在');
    }
    // encrypt the password
    signupData.password = bcryptjs.hashSync(signupData.password, 10);
    await this.user.save(signupData);
    return { message: '注册成功' };
  }
}
