import { isNil } from 'lodash';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuEntity } from './entities/menu.entity';
import { Repository } from 'typeorm';
import { CommonRes } from '@/common/utils/common-res';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private menuRepository: Repository<MenuEntity>,
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
}
