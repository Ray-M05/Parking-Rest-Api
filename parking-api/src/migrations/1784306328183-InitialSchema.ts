import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1784306328183 implements MigrationInterface {
    name = 'InitialSchema1784306328183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "role" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vehicles" ("id" uuid NOT NULL, "ownerId" uuid NOT NULL, "plate" character varying NOT NULL, CONSTRAINT "UQ_ec7181ebdab798d97070122a5bf" UNIQUE ("plate"), CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "parking_spots" ("id" uuid NOT NULL, "code" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_a1e809ee6c0f1ac5a4526c19771" UNIQUE ("code"), CONSTRAINT "PK_e0b54c8ecaf56846b47ef1f32f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reservations" ("id" uuid NOT NULL, "userId" uuid NOT NULL, "vehicleId" uuid NOT NULL, "spotId" uuid NOT NULL, "startTime" TIMESTAMP WITH TIME ZONE NOT NULL, "endTime" TIMESTAMP WITH TIME ZONE NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_da95cef71b617ac35dc5bcda243" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD CONSTRAINT "FK_c0a0d32b2ae04801d6e5b9e5c80" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_aa0e1cc2c4f54da32bf8282154c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_6fb87e1394cb3af4f5745c37d7d" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_1a7fcb7727a323dba6ec8d3f632" FOREIGN KEY ("spotId") REFERENCES "parking_spots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_1a7fcb7727a323dba6ec8d3f632"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_6fb87e1394cb3af4f5745c37d7d"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_aa0e1cc2c4f54da32bf8282154c"`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP CONSTRAINT "FK_c0a0d32b2ae04801d6e5b9e5c80"`);
        await queryRunner.query(`DROP TABLE "reservations"`);
        await queryRunner.query(`DROP TABLE "parking_spots"`);
        await queryRunner.query(`DROP TABLE "vehicles"`);
        await queryRunner.query(`DROP TABLE "users"`);
    } 

}
