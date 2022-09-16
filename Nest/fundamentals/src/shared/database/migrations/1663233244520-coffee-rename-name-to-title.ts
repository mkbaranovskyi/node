import { MigrationInterface, QueryRunner } from "typeorm"

export class coffeeRefactor1663233244520 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
     * npm run build
     * 
     * npx typeorm migration:run -d dist/shared/database/data-source.js
     * # You can also move the static part of the command to `package.json` and run the shorter version:
     * npm run typeorm -- migration:run
     */
    await queryRunner.renameColumn('coffee', 'name', 'title');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /**
     * npm run build
     * 
     * npx typeorm migration:revert -d dist/shared/database/data-source.js
     * # OR
     * npm run typeorm -- migration:revert
     */
    await queryRunner.renameColumn('coffee', 'title', 'name');
  }
}
