import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '@/modules/user/user.entity';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { jwtConfigs } from '@/constants';
import { RedisService } from '@/shared/services/redis.service';
import { CacheEnum } from '@/common/types';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfigs.secret, // Should read from env.
    } as StrategyOptions);
  }

  async validate(payload: { uuid: string; userId: string }) {
    const user = await this.redisService.get(
      `${CacheEnum.LOGIN_TOKEN_KEY}${payload.uuid}`,
    );

    if (!user) {
      throw new UnauthorizedException('Token已经过期，请重新登录');
    }
    return user;
  }
}
