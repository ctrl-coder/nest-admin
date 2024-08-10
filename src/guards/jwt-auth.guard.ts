import { IS_PUBLIC_KEY } from '@/decorators';
import {
  ExecutionContext,
  Injectable,
  // UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Rewrite the folowing method if necessay
   */
  // handleRequest(err, user) {
  //   if (err || !user) {
  //     throw new UnauthorizedException('身份验证失败');
  //   }
  //   return user;
  // }
  // getRequest(context: ExecutionContext) {
  //   const ctx = context.switchToHttp();
  //   return ctx.getRequest();
  // }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
