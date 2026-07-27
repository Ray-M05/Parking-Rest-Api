import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddActiveToUsers1784400000000 implements MigrationInterface {
  name = 'AddActiveToUsers1784400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "active" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "active"`);
  }
}
