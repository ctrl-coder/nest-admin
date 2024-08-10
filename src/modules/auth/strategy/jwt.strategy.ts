import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '@/modules/user/user.entity';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { jwtConfigs } from '@/constants';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfigs.secret, // Should read from env.
    } as StrategyOptions);
  }

  async validate(user: UserEntity) {
    const existUser = await this.authService.getUser(user);

    if (!existUser) {
      throw new UnauthorizedException('token不正确');
    }
    return existUser;
  }
}
