import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterRoleTableAndTheMenuRoleRelation1730823314065
  implements MigrationInterface
{
  name = 'AlterRoleTableAndTheMenuRoleRelation1730823314065';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "menus_roles" DROP CONSTRAINT "FK_619bf9669fe395829dc2ce3c837"`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "permissions"`);
    await queryRunner.query(`DROP TYPE "public"."roles_permissions_enum"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "role_order" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "roles"."role_order" IS '角色顺序'`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "status" integer NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "roles"."status" IS '启用状态 1:normal、 2:disabled'`,
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
      `COMMENT ON COLUMN "roles"."status" IS '启用状态 1:normal、 2:disabled'`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "status"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "roles"."role_order" IS '角色顺序'`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "role_order"`);
    await queryRunner.query(
      `CREATE TYPE "public"."roles_permissions_enum" AS ENUM('ADD', 'VIEW', 'EDIT', 'DELETE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "permissions" "public"."roles_permissions_enum" array NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus_roles" ADD CONSTRAINT "FK_619bf9669fe395829dc2ce3c837" FOREIGN KEY ("menu_id") REFERENCES "menus"("menu_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
