import { difference, isEmpty, isEqual, isNil, omit } from 'lodash';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Request,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { UserEntity } from './user.entity';
import { UserDto } from './dto/user.dto';
import { DepartmentEneity } from '../department/department.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleEntity } from '../role/entities/role.entity';
import { CommonRes } from '@/common/utils/common-res';
import { SUPER_ADMIN } from '@/constants';
import { TransactionManager } from '@/decorators';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(DepartmentEneity)
    private departmentRepository: Repository<DepartmentEneity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    private readonly dataSource: DataSource,
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

  async update(
    username: string,
    updateDto: UpdateUserDto,
    @TransactionManager() transactionManager: EntityManager = null,
  ) {
    // 不能修改超级管理员
    if (username === SUPER_ADMIN.username) {
      throw new BadRequestException('非法操作！');
    }

    const savedUser = await this.findOne(username);
    const savedRoleIds = savedUser.roles.map((v) => v.id);

    const updateRoleIds = updateDto.roles;
    // //过滤掉设置超级管理员角色
    // userDto.roles = userDto.roles.filter((v) => v !== 1);

    // 如果用户角色改变,先删除所有角色关联关系
    const isRolesChanged = !isEqual(updateRoleIds.sort(), savedRoleIds.sort());
    if (isRolesChanged) {
      // 删除原有的user于rule的关联字段
      const toBeDeletedRoleIds = difference(savedRoleIds, updateRoleIds);
      await transactionManager
        .getRepository('users_roles')
        .delete({ user_id: savedUser.id, role_id: In(toBeDeletedRoleIds) });

      const toBeUpdatedRoles = isEmpty(updateRoleIds)
        ? null
        : await this.roleRepository.findBy({ id: In(updateRoleIds) });

      // 如果查询出来的roles与roleId数量不相同，则说明某些roleId不存在
      if (
        Array.isArray(toBeUpdatedRoles) &&
        toBeUpdatedRoles.length !== updateRoleIds.length
      ) {
        throw new BadRequestException(
          `Invalid roles params, roleId: ${difference(
            updateRoleIds,
            toBeUpdatedRoles.map((v) => v.id),
          ).join(', ')} is not existed!`,
        );
      }
      savedUser.roles = toBeUpdatedRoles;
    }

    // 先用update方法更新除关联关系外的基础字段
    await transactionManager.getRepository(UserEntity).update(savedUser.id, {
      ...omit(updateDto, 'roles'),
    });

    // 再使用save方法更新关联字段
    const updatedUser = await transactionManager.getRepository(UserEntity).save(savedUser);

    return CommonRes.ok(updatedUser);
  }

  async getUsers(): Promise<UserDto[]> {
    return [];
  }

  async findOne(username: string): Promise<UserEntity> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder
      .leftJoinAndSelect('user.department', 'department')
      .leftJoinAndSelect('user.roles', 'role')
      .where('user.username = :username', { username });

    const userEntity = await queryBuilder.getOne();
    if (!userEntity) {
      throw new NotFoundException();
    }

    return userEntity;
  }

  async getRoles(id: string): Promise<RoleEntity[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    const user = await queryBuilder
      .leftJoinAndSelect('user.roles', 'role')
      .where('user.id = :id', { id })
      .getOne();

    return user.roles;

    // 优化手段1，直接查询中间表
    // const roleIds = await getRepository('user_roles') // 默认中间表命名为 `user_roles`
    //   .createQueryBuilder('userRole')
    //   .select('userRole.roleId', 'roleId') // 选择关联的角色 ID
    //   .where('userRole.userId = :userId', { userId })
    //   .getRawMany();

    // 优化手段2，关联查询，过滤无用字段
    // const roleIds = await userRepository
    //   .createQueryBuilder('user')
    //   .leftJoin('user.roles', 'role')
    //   .where('user.id = :id', { id: userId })
    //   .select('role.id')
    //   .getMany();
  }
}
