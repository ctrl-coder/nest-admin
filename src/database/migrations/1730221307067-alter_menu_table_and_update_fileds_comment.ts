import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterMenuTableAndUpdateFiledsComment1730221307067
  implements MigrationInterface
{
  name = 'AlterMenuTableAndUpdateFiledsComment1730221307067';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "menus"."menu_type" IS '菜单类型，D: 目录，M：菜单，B：按钮'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "menus"."menu_type" IS '菜单类型，F: 目录，M：菜单，B：按钮'`,
    );
  }
}
