import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterMenuTableFied1730915969014 implements MigrationInterface {
  name = 'AlterMenuTableFied1730915969014';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "menus_roles" DROP CONSTRAINT "FK_619bf9669fe395829dc2ce3c837"`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus" ALTER COLUMN "parent_id" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "menus"."status" IS '菜单状态，1：正常，0：禁用'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "roles"."status" IS '启用状态 1:normal、 0:disabled'`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus_roles" ADD CONSTRAINT "FK_619bf9669fe395829dc2ce3c837" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "menus_roles" DROP CONSTRAINT "FK_619bf9669fe395829dc2ce3c837"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "roles"."status" IS '启用状态 1:normal、 2:disabled'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "menus"."status" IS '菜单状态，0：删除，1：正常，2：禁用'`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus" ALTER COLUMN "parent_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus_roles" ADD CONSTRAINT "FK_619bf9669fe395829dc2ce3c837" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
