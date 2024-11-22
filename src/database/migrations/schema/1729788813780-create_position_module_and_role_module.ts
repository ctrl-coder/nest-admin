import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePositionModuleAndRoleModule1729788813780
  implements MigrationInterface
{
  name = 'CreatePositionModuleAndRoleModule1729788813780';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."roles_permissions_enum" AS ENUM('ADD', 'VIEW', 'EDIT', 'DELETE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" SERIAL NOT NULL, "role_name" character varying(30) NOT NULL, "permissions" "public"."roles_permissions_enum" NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")); COMMENT ON COLUMN "roles"."id" IS '角色ID'; COMMENT ON COLUMN "roles"."role_name" IS '角色名称'; COMMENT ON COLUMN "roles"."permissions" IS '角色权限列表'`,
    );
    await queryRunner.query(
      `CREATE TABLE "positions" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_17e4e62ccd5749b289ae3fae6f3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users_roles" ("user_id" uuid NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "PK_c525e9373d63035b9919e578a9c" PRIMARY KEY ("user_id", "role_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e4435209df12bc1f001e536017" ON "users_roles" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1cf664021f00b9cc1ff95e17de" ON "users_roles" ("role_id") `,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "position_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_8e29a9d2f1fa57ebf1a4ce17353" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles" ADD CONSTRAINT "FK_e4435209df12bc1f001e5360174" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles" ADD CONSTRAINT "FK_1cf664021f00b9cc1ff95e17de4" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_roles" DROP CONSTRAINT "FK_1cf664021f00b9cc1ff95e17de4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles" DROP CONSTRAINT "FK_e4435209df12bc1f001e5360174"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_8e29a9d2f1fa57ebf1a4ce17353"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "position_id"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1cf664021f00b9cc1ff95e17de"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e4435209df12bc1f001e536017"`,
    );
    await queryRunner.query(`DROP TABLE "users_roles"`);
    await queryRunner.query(`DROP TABLE "positions"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TYPE "public"."roles_permissions_enum"`);
  }
}
