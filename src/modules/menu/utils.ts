import { Tree } from '@/common/types';
import { MenuEntity } from './entities/menu.entity';

const sortMenuTree = (tree: Tree<MenuEntity>[]): Tree<MenuEntity>[] => {
  // 递归排序函数

  const sortRecursively = (nodes: Tree<MenuEntity>[]): Tree<MenuEntity>[] => {
    // 排序当前层级节点
    nodes.sort((a, b) => a.order - b.order);

    // 递归处理子节点
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        node.children = sortRecursively(node.children);
      }
    });

    return nodes;
  };

  return sortRecursively(tree);
};

export const buildMenuTree = (menus: MenuEntity[]): Tree<MenuEntity>[] => {
  // 创建一个映射 id -> MenuItem
  const itemMap: Record<number, Tree<MenuEntity>> = {};
  const tree: Tree<MenuEntity>[] = [];

  // 初始化每个节点，并存储到 itemMap
  menus.forEach((item) => {
    itemMap[item.id] = { ...item, children: [] };
  });

  // 构建树
  menus.forEach((item) => {
    const currentItem = itemMap[item.id];
    if (item.parentId === null || item.parentId === 0) {
      // 根节点，直接添加到树中
      tree.push(currentItem);
    } else if (itemMap[item.parentId]) {
      // 子节点，添加到父节点的 children 中
      itemMap[item.parentId].children.push(currentItem);
    }
  });

  return sortMenuTree(tree);
};
