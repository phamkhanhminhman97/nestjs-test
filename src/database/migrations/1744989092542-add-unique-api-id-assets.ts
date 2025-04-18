import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUniqueApiIdAssets1744989092542 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assets" ADD CONSTRAINT "UQ_API_ID" UNIQUE ("api_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assets" DROP CONSTRAINT "UQ_API_ID"`);
  }
}
