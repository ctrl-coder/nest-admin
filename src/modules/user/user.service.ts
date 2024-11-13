import { isNil } from 'lodash';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { UserEntity } from './user.entity';
import { UserDto } from './dto/user.dto';
import { DepartmentEneity } from '../department/department.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleEntity } from '../role/entities/role.entity';
import { CommonRes } from '@/common/utils/common-res';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(DepartmentEneity)
    private departmentRepository: Repository<DepartmentEneity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async validateDuplicated(conditions: { key: string; value: any }[]) {
    for (let index = 0; index < conditions.length; index++) {
      const condition = conditions[index];
      const isExisted = await this.userRepository.findOneBy({
        [condition.key]: condition.value,
      });
      if (isExisted) {
        throw new BadRequestException(`${condition.key} is exited`);
      }
    }
  }

  async create(userDto: CreateUserDto): Promise<any> {
    await this.validateDuplicated([
      { key: 'username', value: userDto.username },
      { key: 'email', value: userDto.email },
    ]);

    const encryptedPassword = bcryptjs.hashSync(userDto.initialPassword, 10);

    const roleIds = userDto.roles;
    const roles = isNil(roleIds)
      ? null
      : await this.roleRepository.findBy({ id: In(roleIds) });

    if (Array.isArray(roles) && roles.length !== roleIds.length) {
      throw new BadRequestException('Invalid roles params!');
    }
    /**
     * TODO: 添加role_id、department_id的业务校验逻辑，
     * 将roles、department等数据缓存到redis，减少数据库查询次数
     */

    const savedUser = await this.userRepository.save({
      ...userDto,
      password: encryptedPassword,
      roles: roles,
    });

    // TODO: call the `.toDto()` method to convert it.
    return CommonRes.ok(savedUser);
  }

  async update(_userDto: UpdateUserDto): Promise<UserDto> {
    return null;
  }

  async getUsers(): Promise<UserDto[]> {
    return [];
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
