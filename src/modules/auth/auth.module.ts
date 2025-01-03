import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfigs } from '@/constants';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { MenuEntity } from '../menu/entities/menu.entity';
import { MenuService } from '../menu/menu.service';

// import { ConfigService } from '@nestjs/config';

// 从configService中异步获取`secret`参数
// const jwtModule = JwtModule.registerAsync({
//   inject: [ConfigService],
//   useFactory: async (configService: ConfigService) => {
//     return {
//       secret: configService.get('SECRET'),
//       signOptions: { expiresIn: '4h' },
//     };
//   },
// });

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, MenuEntity]),
    PassportModule,
    // jwtModule,
    JwtModule.register({
      secret: jwtConfigs.secret,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, MenuService],
  exports: [AuthService],
})
export class AuthModule { }
