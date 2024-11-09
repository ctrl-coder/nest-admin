import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleEntity } from './entities/role.entity';
import { MenuEntity } from '../menu/entities/menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, MenuEntity])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
