import { AbstractDto } from '@/common/dto/abstract.dto';
import { Maybe } from '@/common/types';
import { UserEntity } from '../user.entity';
import { DepartmentEneity } from '@/modules/department/department.entity';

export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class UserDto extends AbstractDto {
  firstName: Maybe<string>;

  lastName: Maybe<string>;

  username!: string;

  email: Maybe<string>;

  avatar: Maybe<string>;

  phone: Maybe<string>;

  isActive?: boolean;

  department!: DepartmentEneity;

  constructor(user: UserEntity, options?: UserDtoOptions) {
    super();
    this.email = user.email;
    this.avatar = user.avatar;
    this.phone = user.phone;
    this.isActive = options?.isActive;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.department = user.department;
  }
}
