import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { isEmpty } from 'lodash';
import { UserRegisterDto } from './dto/user-register.dto';
// import { jwtConfigs } from '@/constants';
import { RedisService } from '@/shared/services/redis.service';
import { redisConfigs } from '@/constants/redis';
import { MenuEntity } from '../menu/entities/menu.entity';
import { generateUUID } from '@/common/utils';
import { CacheEnum } from '@/common/types';
import { MenuService } from '../menu/menu.service';

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
    private readonly menuService: MenuService,
  ) {}

  async getUser(user: UserEntity) {
    return this.user.findOneBy({ username: user.username });
  }

  /**
   * 从令牌中获取数据声明
   *
   * @param token 令牌
   * @return 数据声明
   */
  parseToken(token: string) {
    try {
      if (!token) return null;
      return this.jwtService.verify(token.replace('Bearer ', ''));
    } catch (error) {
      return null;
    }
  }

  async login(user: Partial<UserEntity>) {
    // 这里使用uuid作为redis key，而不是user id，是为了支持用户多端登录的场景，
    // 1. 当用户登陆后，生成uuid对应的token
    // 2. 以集合的形式，以user id作为key将uuid存储到user id对应的redis集合中，每个user id可以生成/保持多个token
    const uuid = generateUUID();
    const payload = {
      userId: user.id,
      uuid: uuid,
    };
    const accessToken = this.jwtService.sign(payload);

    const roleIds = user.roles.map((v) => v.id);

    const metaData = {
      token: uuid,
      roles: [],
      permissions: [],
      username: user.username,
      id: user.id,
    };

    if (!isEmpty(roleIds)) {
      // TODO: extra to a single method and use menuService but not menoRepository
      const menus = await this.menuService.findMenusByRoles(roleIds);
      const permissions = menus.map((v) => v.perms);
      const roles = user.roles.map((v) => v.name);

      metaData.permissions = permissions;
      metaData.roles = roles;
    }

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
