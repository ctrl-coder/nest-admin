import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { DepartmentEneity } from '../department/department.entity';
import { RoleEntity } from '../role/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, DepartmentEneity, RoleEntity]),
  ],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
