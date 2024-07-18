import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1721259707955 implements MigrationInterface {
    name = 'Migration1721259707955'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profile_status" ("id" SERIAL NOT NULL, "status" "public"."profile_status_status_enum" NOT NULL, "failureReason" character varying, "retryCount" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "profileId" integer, CONSTRAINT "PK_668c4ce803b58dd0d5ce5f0af50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profile" ("id" SERIAL NOT NULL, "zohoProfileId" character varying NOT NULL, "displayLabel" character varying NOT NULL, "createdTime" TIMESTAMP, "modifiedTime" TIMESTAMP, "custom" boolean NOT NULL, CONSTRAINT "UQ_2c853615ed2aef085d5c5a8e28a" UNIQUE ("zohoProfileId"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_token" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "profile_status" ADD CONSTRAINT "FK_52ce35ee67931fc2443a4692622" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_status" DROP CONSTRAINT "FK_52ce35ee67931fc2443a4692622"`);
        await queryRunner.query(`DROP TABLE "refresh_token"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TABLE "profile_status"`);
    }

}
