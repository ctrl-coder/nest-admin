import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['username', 'initialPassword'] as const),
) {}
