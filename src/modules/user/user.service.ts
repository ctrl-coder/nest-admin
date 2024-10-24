import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { UserEntity } from './user.entity';
import { UserDto } from './dto/user.dto';
import { DepartmentEneity } from '../department/department.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(DepartmentEneity)
    private departmentRepository: Repository<DepartmentEneity>,
  ) {}

  async create(userDto: CreateUserDto): Promise<UserDto> {
    const queryBuilder = await this.departmentRepository
      .createQueryBuilder('department')
      .where('department.id = :id', { id: userDto.department });

    const departmentEntity = await queryBuilder.getOne();
    const randomInitialPassword = 'abc';
    const encryptedPassword = bcryptjs.hashSync(randomInitialPassword, 10);

    const savedUser = await this.userRepository.save({
      ...userDto,
      password: encryptedPassword,
      department: departmentEntity,
    });
    return savedUser.toDto();
  }

  async findOne(username: string): Promise<UserDto> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder
      .leftJoinAndSelect('user.department', 'department')
      .where('user.username = :username', { username });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new NotFoundException();
    }

    return userEntity.toDto();
  }
}
