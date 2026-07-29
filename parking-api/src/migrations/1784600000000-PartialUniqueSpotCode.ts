import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartialUniqueSpotCode1784600000000 implements MigrationInterface {
  name = 'PartialUniqueSpotCode1784600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "parking_spots" DROP CONSTRAINT "UQ_a1e809ee6c0f1ac5a4526c19771"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_parking_spots_code_active" ON "parking_spots" ("code") WHERE "active" = true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_parking_spots_code_active"`);
    await queryRunner.query(
      `ALTER TABLE "parking_spots" ADD CONSTRAINT "UQ_a1e809ee6c0f1ac5a4526c19771" UNIQUE ("code")`,
    );
  }
}
