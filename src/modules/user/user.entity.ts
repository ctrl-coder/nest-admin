import { AbstractEntity } from '@/common/abstract.entity';
import { Maybe } from '@/common/type';
import { RoleType } from '@/constants';
import { Entity, Column, VirtualColumn, ManyToOne } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { DepartmentEneity } from '../department/department.entity';
import { UseDto } from '@/decorators';

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto> {
  @Column({ nullable: false, unique: true, type: 'varchar' })
  username: string;

  @Column({ nullable: true, type: 'varchar' })
  firstName: Maybe<string>;

  @Column({ nullable: true, type: 'varchar' })
  lastName: Maybe<string>;

  @Column({
    type: 'enum',
    enum: RoleType,
    enumName: 'RoleTypeEnum',
    default: RoleType.USER,
  })
  role: RoleType;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  email: Maybe<string>;

  @Column({ nullable: true, type: 'varchar' })
  phone: Maybe<string>;

  @Column({ nullable: false, type: 'varchar' })
  password: string;

  @Column({ nullable: true, type: 'varchar' })
  avatar: Maybe<string>;

  @VirtualColumn({
    query: (alias) =>
      `SELECT CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`,
  })
  fullName: string;

  @ManyToOne(() => DepartmentEneity, (department) => department.users)
  department: DepartmentEneity;
}
