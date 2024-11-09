import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterMenuTableIconFieldToNullable1730916405050 implements MigrationInterface {
    name = 'AlterMenuTableIconFieldToNullable1730916405050'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menus_roles" DROP CONSTRAINT "FK_619bf9669fe395829dc2ce3c837"`);
        await queryRunner.query(`ALTER TABLE "menus" ALTER COLUMN "icon" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "menus_roles" ADD CONSTRAINT "FK_619bf9669fe395829dc2ce3c837" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menus_roles" DROP CONSTRAINT "FK_619bf9669fe395829dc2ce3c837"`);
        await queryRunner.query(`ALTER TABLE "menus" ALTER COLUMN "icon" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "menus_roles" ADD CONSTRAINT "FK_619bf9669fe395829dc2ce3c837" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
