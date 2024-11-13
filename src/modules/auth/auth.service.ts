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
import { MenuEntity } from '../menu/entities/menu.entity';
import { generateUUID } from '@/common/utils';
import { CacheEnum } from '@/common/types';

@Injectable()
export class AuthService {
  constructor(
    // TODO: refactor it and use the user service.
    @InjectRepository(UserEntity)
    private readonly user: Repository<UserEntity>,
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,

    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async getUser(user: UserEntity) {
    return this.user.findOneBy({ username: user.username });
  }

  async login(user: Partial<UserEntity>) {
    const uuid = generateUUID();
    const payload = {
      userId: user.id,
      uuid: uuid,
    };
    const accessToken = this.jwtService.sign(payload);

    const roleIds = user.roles.map((v) => v.id);
    // TODO: extra to a single method and use menuService but not menoRepository
    const menus = await this.menuRepository
      .createQueryBuilder('menu')
      .innerJoin('menu.roles', 'role')
      .where('role.id IN (:...roleIds)', { roleIds })
      .getMany();

    const permissions = menus.map((v) => v.perms);
    const roles = user.roles.map((v) => v.name);

    const metaData = {
      token: uuid,
      roles,
      permissions,
      username: user.username,
      id: user.id,
    };
    await this.redisService.set(
      `${CacheEnum.LOGIN_TOKEN_KEY}${uuid}`,
      metaData,
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
