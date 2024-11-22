import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterMenuTableFied1730829395768 implements MigrationInterface {
  name = 'AlterMenuTableFied1730829395768';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "menus_roles" DROP CONSTRAINT "FK_619bf9669fe395829dc2ce3c837"`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus" DROP CONSTRAINT "PK_8fd2708e7b132186c634f02ed11"`,
    );
    await queryRunner.query(`ALTER TABLE "menus" DROP COLUMN "menu_id"`);
    await queryRunner.query(`ALTER TABLE "menus" DROP COLUMN "menu_name"`);
    await queryRunner.query(`ALTER TABLE "menus" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "menus" ADD CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "menus"."id" IS '菜单ID'`);
    await queryRunner.query(
      `ALTER TABLE "menus" ADD "name" character varying(30) NOT NULL`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "menus"."name" IS '菜单名称'`);
    await queryRunner.query(
      `ALTER TABLE "menus" ADD "query" character varying(255) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "menus"."query" IS '路由参数'`);
    await queryRunner.query(
      `ALTER TABLE "menus" ADD "visiable" integer NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "menus"."visiable" IS '是否展示，0：隐藏，1：显示'`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus" ADD "is_cache" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "menus"."is_cache" IS '是否缓存，0：不缓存，1：缓存'`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus" ADD "is_external_link" integer NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "menus"."is_external_link" IS '是否是外链，是: 1 ，否: 0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus" ALTER COLUMN "order" SET DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "menus" DROP COLUMN "path"`);
    await queryRunner.query(
      `ALTER TABLE "menus" ADD "path" character varying(255) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "menus"."path" IS '菜单路由'`);
    await queryRunner.query(
      `ALTER TABLE "menus" ALTER COLUMN "component" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "menus" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."menus_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "menus" ADD "status" integer NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "menus"."status" IS '菜单状态，0：删除，1：正常，2：禁用'`,
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
      `COMMENT ON COLUMN "menus"."status" IS '菜单状态，0：删除，1：正常，2：禁用'`,
    );
    await queryRunner.query(`ALTER TABLE "menus" DROP COLUMN "status"`);
    await queryRunner.query(
      `CREATE TYPE "public"."menus_status_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus" ADD "status" "public"."menus_status_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus" ALTER COLUMN "component" SET NOT NULL`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "menus"."path" IS '菜单路由'`);
    await queryRunner.query(`ALTER TABLE "menus" DROP COLUMN "path"`);
    await queryRunner.query(
      `ALTER TABLE "menus" ADD "path" character varying(200) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus" ALTER COLUMN "order" DROP DEFAULT`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "menus"."is_external_link" IS '是否是外链，是: 1 ，否: 0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus" DROP COLUMN "is_external_link"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "menus"."is_cache" IS '是否缓存，0：不缓存，1：缓存'`,
    );
    await queryRunner.query(`ALTER TABLE "menus" DROP COLUMN "is_cache"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "menus"."visiable" IS '是否展示，0：隐藏，1：显示'`,
    );
    await queryRunner.query(`ALTER TABLE "menus" DROP COLUMN "visiable"`);
    await queryRunner.query(`COMMENT ON COLUMN "menus"."query" IS '路由参数'`);
    await queryRunner.query(`ALTER TABLE "menus" DROP COLUMN "query"`);
    await queryRunner.query(`COMMENT ON COLUMN "menus"."name" IS '菜单名称'`);
    await queryRunner.query(`ALTER TABLE "menus" DROP COLUMN "name"`);
    await queryRunner.query(`COMMENT ON COLUMN "menus"."id" IS '菜单ID'`);
    await queryRunner.query(
      `ALTER TABLE "menus" DROP CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4"`,
    );
    await queryRunner.query(`ALTER TABLE "menus" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "menus" ADD "menu_name" character varying(30) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus" ADD "menu_id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus" ADD CONSTRAINT "PK_8fd2708e7b132186c634f02ed11" PRIMARY KEY ("menu_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus_roles" ADD CONSTRAINT "FK_619bf9669fe395829dc2ce3c837" FOREIGN KEY ("menu_id") REFERENCES "menus"("menu_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
