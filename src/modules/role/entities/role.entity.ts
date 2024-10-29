import { RolePermission } from '@/common/types';
import { MenuEntity } from '@/modules/menu/entities/menu.entity';
import { UserEntity } from '@/modules/user/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'roles' })
export class RoleEntity {
  @PrimaryGeneratedColumn({ type: 'int', comment: '角色ID' })
  id: number;

  @Column({
    type: 'varchar',
    name: 'role_name',
    length: 30,
    comment: '角色名称',
  })
  public roleName: string;

  @Column({
    type: 'enum',
    enum: RolePermission,
    comment: '角色权限列表',
    array: true,
  })
  permissions: RolePermission[];

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];

  @ManyToMany(() => MenuEntity, (menu) => menu.roles)
  menus: MenuEntity[];
}
