import { isNil, uniq } from 'lodash';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuEntity } from './entities/menu.entity';
import { In, Repository } from 'typeorm';
import { CommonRes } from '@/common/utils/common-res';
import { SUPER_ADMIN } from '@/constants';
import { buildMenuTree } from './utils';
import { UserService } from '../user/user.service';

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

  findAll() {
    return `This action returns all menu`;
  }

  findOne(id: number) {
    return `This action returns a #${id} menu`;
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return `This action updates a #${id} menu`;
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }

  async getAllAccessibleMenus(userId: string) {
    // step1: 判断用于角色是不是超级管理员
    const roles = await this.userService.getRoles(userId);
    const roleIds = roles.map((v) => v.id);

    console.log('===============', roleIds);

    // if (roleIds.includes(SUPER_ADMIN.role.id)) {
    //   // step2: 超级管理员获取所有菜单列表
    // } else {
    //   // step3: 非管理员用户获取权限对应的菜单列表
    // }

    // // 菜单Id去重
    // const menuIds = uniq(menuWidthRoleList.map((item) => item.menuId));
    // // 菜单列表
    // const menuList = await this.menuRepository.find({
    //   where: {
    //     menuId: In(menuIds),
    //   },
    // });
    // // step4: 将菜单树成层级返回
    // const menuTree = buildMenuTree(menuList);
    // return menuTree as any;
  }
}
