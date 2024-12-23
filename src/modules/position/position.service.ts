import { Injectable } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { CommonRes } from '@/common/utils/common-res';
import { InjectRepository } from '@nestjs/typeorm';
import { PositionEntity } from './entities/position.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(PositionEntity)
    private positionRepository: Repository<PositionEntity>,
  ) {}

  create(createPositionDto: CreatePositionDto) {
    return 'This action adds a new position';
  }

  findAll() {
    return `This action returns all position`;
  }

  findOne(id: number) {
    return `This action returns a #${id} position`;
  }

  async update(id: number, updatePositionDto: UpdatePositionDto) {
    const res = await this.positionRepository.update({ id }, updatePositionDto);
    return CommonRes.ok(res);
  }

  remove(id: number) {
    return `This action removes a #${id} position`;
  }
}
