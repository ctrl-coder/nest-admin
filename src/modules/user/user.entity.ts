import { AbstractEntity } from '@/common/abstract.entity';
import { Maybe } from '@/common/type';
import { RoleType } from '@/constants';
import { Entity, Column, VirtualColumn } from 'typeorm';
import { UserDto } from './dto/user.dto';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> {
  @Column({ nullable: true, type: 'varchar' })
  firstName: Maybe<string>;

  @Column({ nullable: true, type: 'varchar' })
  lastName: Maybe<string>;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: number;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  email: Maybe<string>;

  @Column({ nullable: true, type: 'varchar' })
  phone: Maybe<string>;

  @Column({ nullable: true, type: 'varchar' })
  password: Maybe<string>;

  @Column({ nullable: true, type: 'varchar' })
  avatar: Maybe<string>;

  @VirtualColumn({
    query: (alias) =>
      `SELECT CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`,
  })
  fullName: string;
}
