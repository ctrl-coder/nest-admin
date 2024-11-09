import {
  BooleanStatus,
  CommonStatus,
  Maybe,
  MenuTypeEnum,
} from '@/common/types';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @Length(0, 30)
  public name: string;

  @IsNumber()
  public parentId: Maybe<number>;

  @IsNumber()
  public order: number;

  @IsString()
  @Length(0, 255)
  @IsOptional()
  public path: Maybe<string>;

  @IsString()
  @Length(0, 255)
  @IsOptional()
  public query: Maybe<string>;

  @IsString()
  @Length(0, 255)
  @IsOptional()
  public component: Maybe<string>;

  @IsString()
  @IsOptional()
  @Length(0, 100)
  public icon: Maybe<string>;

  @IsEnum(MenuTypeEnum)
  public menuType: MenuTypeEnum;

  @IsEnum(CommonStatus)
  public status: CommonStatus;

  @IsEnum(BooleanStatus)
  public visiable: BooleanStatus;

  @IsEnum(BooleanStatus)
  public isCache: BooleanStatus;

  @IsEnum(BooleanStatus)
  public isExternalLink: BooleanStatus;

  @IsString()
  @Length(0, 100)
  public perms: string;
}
