import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateThePermissionsFieldOfRoleTable1729790753141
  implements MigrationInterface
{
  name = 'UpdateThePermissionsFieldOfRoleTable1729790753141';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "permissions"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "permissions" "public"."roles_permissions_enum" array NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "roles"."permissions" IS '角色权限列表'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "roles"."permissions" IS '角色权限列表'`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "permissions"`);
    await queryRunner.query(
      `CREATE TYPE "public"."roles_permissions_enum" AS ENUM('ADD', 'VIEW', 'EDIT', 'DELETE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "permissions" "public"."roles_permissions_enum" NOT NULL`,
    );
  }
}
