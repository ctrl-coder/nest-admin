import { isNil } from 'lodash';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuEntity } from './entities/menu.entity';
import { Repository } from 'typeorm';
import { CommonRes } from '@/common/utils/common-res';
import { SUPER_ADMIN } from '@/constants';
import { UserService } from '../user/user.service';
import { uniqBy } from 'lodash';
import { buildMenuTree } from './utils';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private menuRepository: Repository<MenuEntity>,
    private readonly userService: UserService,
  ) {}
  async create(createMenuDto: CreateMenuDto) {
    const { parentId } = createMenuDto;
    if (!isNil(parentId) && parentId !== 0) {
      const parentMenu = await this.menuRepository.findOneBy({ id: parentId });

      if (!parentMenu) {
        throw new BadRequestException('parentId不存在！');
      }
    }
    const menuEntity = await this.menuRepository.save(createMenuDto);
    return CommonRes.ok(menuEntity);
  }

  async findAll() {
    return await this.menuRepository.find();
  }

  async findAllMenus() {
    const res = await this.findAll();
    return CommonRes.ok(res);
  }

  async findOne(id: number) {
    const res = await this.menuRepository.findOneBy({ id });
    return CommonRes.ok(res);
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    const res = await this.menuRepository.update({ id }, updateMenuDto);
    return CommonRes.ok(res);
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }

  async findMenusByRoles(roleIds: number[]): Promise<MenuEntity[]> {
    return await this.menuRepository
      .createQueryBuilder('menu')
      .innerJoin('menu.roles', 'role')
      .where('role.id IN (:...roleIds)', { roleIds })
      .getMany();
  }

  async getAllAccessibleMenus(userId: string) {
    // step1: 判断用于角色是不是超级管理员
    const roles = await this.userService.getRoles(userId);
    const roleIds = roles.map((v) => v.id);

    let menus: MenuEntity[] = [];
    if (roleIds.includes(SUPER_ADMIN.role.id)) {
      // step2: 超级管理员获取所有菜单列表
      menus = await this.findAll();
    } else {
      // step3: 非管理员用户获取权限对应的菜单列表
      menus = await this.findMenusByRoles(roleIds);
    }

    // 菜单Id去重
    const uniqueMenus = uniqBy(menus, (menu) => menu.id);

    // step4: 将菜单树成层级返回
    const sortedMenuTree = buildMenuTree(uniqueMenus);
    return CommonRes.ok(sortedMenuTree);
  }
}
