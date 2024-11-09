import { MenuEntity } from '@/modules/menu/entities/menu.entity';
import { UserEntity } from '@/modules/user/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'roles' })
export class RoleEntity {
  @PrimaryGeneratedColumn({ type: 'int', comment: '角色ID' })
  id: number;

  @Column({
    type: 'varchar',
    name: 'name',
    length: 30,
    comment: '角色名称',
  })
  public name: string;

  @Column({
    type: 'int',
    name: 'order',
    default: 0,
    comment: '角色顺序',
  })
  public order: number;

  @Column({
    type: 'int',
    name: 'status',
    default: 2,
    comment: '启用状态 1:normal、 0:disabled',
  })
  public status: number;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];

  @ManyToMany(() => MenuEntity, (menu) => menu.roles)
  @JoinTable({
    name: 'menus_roles',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'menu_id' },
  }) // Create the related table
  menus: MenuEntity[];
}
