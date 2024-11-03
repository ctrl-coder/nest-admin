export type Maybe<T> = T | null;

export type Constructor<T = any, Arguments extends unknown[] = any[]> = new (
  ...arguments_: Arguments
) => T;

export enum OrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum CommonStatus {
  Deleted = 0,
  Normal = 1,
  Disabled = 2,
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
