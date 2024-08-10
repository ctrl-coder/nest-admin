import type { CustomDecorator } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';

export const PUBLIC_ROUTE_KEY = 'public_route';

export const IS_PUBLIC_KEY = 'isPublic';
export const PublicRoute = (): CustomDecorator =>
  SetMetadata(IS_PUBLIC_KEY, true);
