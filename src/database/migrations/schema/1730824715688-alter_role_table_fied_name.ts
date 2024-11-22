import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterRoleTableFiedName1730824715688 implements MigrationInterface {
  name = 'AlterRoleTableFiedName1730824715688';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "menus_roles" DROP CONSTRAINT "FK_619bf9669fe395829dc2ce3c837"`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "role_name"`);
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "role_order"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "name" character varying(30) NOT NULL`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "roles"."name" IS '角色名称'`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "order" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "roles"."order" IS '角色顺序'`);
    await queryRunner.query(
      `ALTER TABLE "roles" ALTER COLUMN "status" SET DEFAULT '2'`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus_roles" ADD CONSTRAINT "FK_619bf9669fe395829dc2ce3c837" FOREIGN KEY ("menu_id") REFERENCES "menus"("menu_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "menus_roles" DROP CONSTRAINT "FK_619bf9669fe395829dc2ce3c837"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "roles"."order" IS '角色顺序'`);
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "order"`);
    await queryRunner.query(`COMMENT ON COLUMN "roles"."name" IS '角色名称'`);
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "role_order" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "role_name" character varying(30) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus_roles" ADD CONSTRAINT "FK_619bf9669fe395829dc2ce3c837" FOREIGN KEY ("menu_id") REFERENCES "menus"("menu_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
