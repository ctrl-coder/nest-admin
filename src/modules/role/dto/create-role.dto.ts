import { CommonStatus, Maybe } from '@/common/types';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  order: number;

  @IsNumber()
  @IsOptional()
  status: Maybe<CommonStatus>;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  remark: Maybe<string>;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true }) // Each of the items are Number type
  menus: Maybe<number[]>;
}
