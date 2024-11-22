import { MenuEntity } from './entities/menu.entity';

type MenuTree = {
  children: MenuTree[];
};

export const buildMenuTree = (menu: MenuEntity[]): MenuTree => {
  return {} as any;
};
