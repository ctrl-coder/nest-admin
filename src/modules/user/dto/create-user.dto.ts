import { AbstractDto } from '@/common/dto/abstract.dto';
import { Maybe, SexEnum } from '@/common/types';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class CreateUserDto extends AbstractDto {
  @IsNotEmpty()
  @IsString()
  @Length(0, 50)
  nickName: Maybe<string>;

  @IsNotEmpty()
  @Length(0, 50)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(0, 50)
  initialPassword: string;

  @IsOptional()
  @IsNumber()
  departmentId: Maybe<number>;

  @IsOptional()
  @IsEmail()
  @Length(0, 50)
  email: Maybe<string>;

  // @IsOptional()
  // @IsString()
  // avatar: Maybe<string>;

  @IsNumber()
  @IsOptional()
  positionId: Maybe<number>;

  @IsArray()
  @IsNumber({}, { each: true }) // Each of the items are Number type
  @IsOptional()
  roles: Maybe<number[]>;

  @IsEnum(SexEnum)
  sex: Maybe<SexEnum>;

  @Length(0, 20)
  @IsOptional()
  phone: Maybe<string>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @Length(0, 200)
  @IsOptional()
  remark: Maybe<string>;
}
