import { MigrationInterface, QueryRunner } from "typeorm";

export class coffeeAddedDescription1663256433783 implements MigrationInterface {
    name = 'coffeeAddedDescription1663256433783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" DROP COLUMN "description"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" ADD "description" character varying`);
    }

}
