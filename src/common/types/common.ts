export type Maybe<T> = T | null;

export type Constructor<T = any, Arguments extends unknown[] = any[]> = new (
  ...arguments_: Arguments
) => T;

export enum OrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum DeletableStatus {
  Deleted = 2,
  Normal = 1,
  Disabled = 0,
}

export enum CommonStatus {
  Normal = 1,
  Disabled = 0,
}

export enum BooleanStatus {
  true = 1,
  false = 0,
}

export enum MenuTypeEnum {
  Directory = 'D',
  Menu = 'M',
  Button = 'B',
}

export enum SexEnum {
  Man = 1,
  Woman = 2,
}
