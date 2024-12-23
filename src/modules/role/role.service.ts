import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { In, Repository } from 'typeorm';
import { RoleEntity } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRes } from '@/common/utils/common-res';
import { MenuEntity } from '../menu/entities/menu.entity';
import { difference } from 'lodash';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(MenuEntity)
    private menuRepository: Repository<MenuEntity>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    const menuEntities = await this.menuRepository.findBy({
      id: In(createRoleDto.menus),
    });

    if (menuEntities.length !== createRoleDto.menus.length) {
      const ids = difference(
        menuEntities.map((v) => v.id),
        createRoleDto.menus,
      );
      throw new BadRequestException(`menu_id ${ids.join(', ')}不存在!`);
    }

    const savedRole = await this.roleRepository.save({
      ...createRoleDto,
      menus: menuEntities,
    });
    // TODO: should call the `.toDTO()` to convert the entity.
    return CommonRes.ok(savedRole);
  }

  findAll() {
    return `This action returns all role`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const updatedRole = await this.roleRepository.update({ id }, {});

    return CommonRes.ok(updatedRole);
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
