import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterMenuTableAndAddFields1730221146758
  implements MigrationInterface
{
  name = 'AlterMenuTableAndAddFields1730221146758';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "menus" ADD "perms" character varying(100) NOT NULL`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "menus"."perms" IS '权限标识'`);
    await queryRunner.query(
      `CREATE TYPE "public"."menus_menu_type_enum" AS ENUM('D', 'M', 'B')`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus" ADD "menu_type" "public"."menus_menu_type_enum" NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "menus"."menu_type" IS '菜单类型，F: 目录，M：菜单，B：按钮'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "menus"."menu_type" IS '菜单类型，F: 目录，M：菜单，B：按钮'`,
    );
    await queryRunner.query(`ALTER TABLE "menus" DROP COLUMN "menu_type"`);
    await queryRunner.query(`DROP TYPE "public"."menus_menu_type_enum"`);
    await queryRunner.query(`COMMENT ON COLUMN "menus"."perms" IS '权限标识'`);
    await queryRunner.query(`ALTER TABLE "menus" DROP COLUMN "perms"`);
  }
}
