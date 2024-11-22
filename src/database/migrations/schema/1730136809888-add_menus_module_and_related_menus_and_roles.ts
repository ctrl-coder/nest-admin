import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMenusModuleAndRelatedMenusAndRoles1730136809888
  implements MigrationInterface
{
  name = 'AddMenusModuleAndRelatedMenusAndRoles1730136809888';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."menus_status_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `CREATE TABLE "menus" ("menu_id" SERIAL NOT NULL, "menu_name" character varying(30) NOT NULL, "parent_id" integer NOT NULL, "order" integer NOT NULL, "path" character varying(200) NOT NULL, "component" character varying(255) NOT NULL, "status" "public"."menus_status_enum" NOT NULL, "icon" character varying(100) NOT NULL, CONSTRAINT "PK_8fd2708e7b132186c634f02ed11" PRIMARY KEY ("menu_id")); COMMENT ON COLUMN "menus"."menu_id" IS '角色ID'; COMMENT ON COLUMN "menus"."menu_name" IS '菜单名称'; COMMENT ON COLUMN "menus"."parent_id" IS '父级菜单'; COMMENT ON COLUMN "menus"."order" IS '显示顺序'; COMMENT ON COLUMN "menus"."path" IS '菜单路由'; COMMENT ON COLUMN "menus"."component" IS '菜单组件'; COMMENT ON COLUMN "menus"."status" IS '菜单状态，0：删除，1：正常，2：禁用'; COMMENT ON COLUMN "menus"."icon" IS '菜单图标'`,
    );
    await queryRunner.query(
      `CREATE TABLE "menus_roles" ("menu_id" integer NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "PK_c2147370be53f2575456e3cba80" PRIMARY KEY ("menu_id", "role_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_619bf9669fe395829dc2ce3c83" ON "menus_roles" ("menu_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_17a0a407ed4dcd20b57121cd15" ON "menus_roles" ("role_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "menus_roles" ADD CONSTRAINT "FK_619bf9669fe395829dc2ce3c837" FOREIGN KEY ("menu_id") REFERENCES "menus"("menu_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus_roles" ADD CONSTRAINT "FK_17a0a407ed4dcd20b57121cd15f" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "menus_roles" DROP CONSTRAINT "FK_17a0a407ed4dcd20b57121cd15f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus_roles" DROP CONSTRAINT "FK_619bf9669fe395829dc2ce3c837"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_17a0a407ed4dcd20b57121cd15"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_619bf9669fe395829dc2ce3c83"`,
    );
    await queryRunner.query(`DROP TABLE "menus_roles"`);
    await queryRunner.query(`DROP TABLE "menus"`);
    await queryRunner.query(`DROP TYPE "public"."menus_status_enum"`);
  }
}
