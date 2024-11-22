import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDepartmentTableAndRelateUserTable1729613693371
  implements MigrationInterface
{
  name = 'CreateDepartmentTableAndRelateUserTable1729613693371';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "departments" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_839517a681a86bb84cbcc6a1e9d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "department_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_0921d1972cf861d568f5271cd85" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_0921d1972cf861d568f5271cd85"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "department_id"`);
    await queryRunner.query(`DROP TABLE "departments"`);
  }
}
