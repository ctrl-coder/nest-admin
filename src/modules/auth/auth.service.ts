import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { UserRegisterDto } from './dto/user-register.dto';
// import { jwtConfigs } from '@/constants';
import { RedisService } from '@/shared/services/redis.service';
import { redisConfigs } from '@/constants/redis';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly user: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async getUser(user: UserEntity) {
    return this.user.findOneBy({ username: user.username });
  }

  async login(user: Partial<UserEntity>) {
    const payload = { username: user.username, roles: user.roles };
    const accessToken = this.jwtService.sign(payload);
    await this.redisService.set(
      user.id,
      accessToken,
      redisConfigs.jwtTokenExpiresIn,
    );
    return {
      access_token: accessToken,
    };
  }

  async logout(user: Partial<UserEntity>) {
    await this.redisService.del(user.id);
    return {
      message: '登出成功',
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
