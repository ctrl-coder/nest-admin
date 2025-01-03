import { IS_PUBLIC_KEY } from '@/decorators';
import { AuthService } from '@/modules/auth/auth.service';
import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {
    super();
  }

  async checkAuth(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const accessToken = req.get('Authorization');
    if (!accessToken) throw new ForbiddenException('请先登录');

    const parseToken = await this.authService.parseToken(accessToken);
    if (!parseToken) {
      throw new UnauthorizedException('当前登录已过期，请重新登录');
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.checkPublicPath(context);
    if (isPublic) {
      return true;
    }
    // check Auth
    await this.checkAuth(context);
    return await this.activate(context);
  }

  async activate(ctx: ExecutionContext): Promise<boolean> {
    return super.canActivate(ctx) as Promise<boolean>;
  }

  checkPublicPath(ctx: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
  }
}
