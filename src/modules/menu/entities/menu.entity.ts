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
  @PrimaryGeneratedColumn({ type: 'int', comment: '菜单ID' })
  id: number;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '菜单名称',
    nullable: false,
  })
  public name: string;

  @Column({
    type: 'int',
    default: 0, // 默认是主目录
    comment: '父级菜单',
    nullable: false,
  })
  public parentId: number;

  @Column({
    type: 'int',
    default: 0,
    comment: '显示顺序',
    nullable: false,
  })
  public order: number;

  @Column({
    type: 'varchar',
    length: 255,
    default: '',
    comment: '菜单路由',
  })
  public path: string;

  @Column({
    type: 'varchar',
    name: 'query',
    length: 255,
    default: '',
    comment: '路由参数',
  })
  public query: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '菜单组件',
  })
  public component: string;

  @Column({
    type: 'int',
    default: 1,
    comment: '菜单状态，1：正常，0：禁用',
  })
  public status: CommonStatus;

  @Column({
    type: 'int',
    default: 1,
    comment: '是否展示，0：隐藏，1：显示',
  })
  public visiable: number;

  @Column({
    type: 'int',
    default: 0,
    comment: '是否缓存，0：不缓存，1：缓存',
  })
  public isCache: number;

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
    name: 'is_external_link',
    type: 'int',
    comment: '是否是外链，是: 1 ，否: 0',
  })
  public isExternalLink: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
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
