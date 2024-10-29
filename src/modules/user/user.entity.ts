import { AbstractEntity } from '@/common/abstract.entity';
import { Maybe } from '@/common/types';
import {
  Entity,
  Column,
  VirtualColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserDto } from './dto/user.dto';
import { DepartmentEneity } from '../department/department.entity';
import { UseDto } from '@/decorators';
import { RoleEntity } from '../role/entities/role.entity';
import { PositionEntity } from '../position/entities/position.entity';

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto> {
  @Column({ nullable: false, unique: true, type: 'varchar' })
  username: string;

  @Column({ nullable: true, type: 'varchar' })
  firstName: Maybe<string>;

  @Column({ nullable: true, type: 'varchar' })
  lastName: Maybe<string>;

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

  @ManyToOne(() => PositionEntity, (position) => position.users)
  position: DepartmentEneity;

  @ManyToMany(() => RoleEntity)
  @JoinTable({
    name: 'users_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  }) // Create the related table
  roles: RoleEntity[];
}
