import { CommonStatus, MenuTypeEnum } from '@/common/types';
import { RoleEntity } from '@/modules/role/entities/role.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'menus' })
export class MenuEntity {
  @PrimaryGeneratedColumn({ type: 'int', comment: '角色ID' })
  menu_id: number;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '菜单名称',
  })
  public menuName: string;

  @Column({
    type: 'int',
    comment: '父级菜单',
  })
  public parentId: number;

  @Column({
    type: 'int',
    comment: '显示顺序',
  })
  public order: number;

  @Column({
    type: 'varchar',
    length: 200,
    comment: '菜单路由',
  })
  public path: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '菜单组件',
  })
  public component: string;

  @Column({
    type: 'enum',
    enum: CommonStatus,
    comment: '菜单状态，0：删除，1：正常，2：禁用',
  })
  public status: CommonStatus;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '权限标识',
  })
  public perms: string;

  @Column({
    name: 'menu_type',
    type: 'enum',
    enum: MenuTypeEnum,
    comment: '菜单类型，D: 目录，M：菜单，B：按钮',
  })
  public menuType: MenuTypeEnum;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '菜单图标',
  })
  public icon: string;

  @ManyToMany(() => RoleEntity)
  @JoinTable({
    name: 'menus_roles',
    joinColumn: { name: 'menu_id' },
    inverseJoinColumn: { name: 'role_id' },
  }) // Create the related table
  roles: RoleEntity[];
}
