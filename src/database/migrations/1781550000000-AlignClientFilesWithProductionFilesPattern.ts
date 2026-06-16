import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlignClientFilesWithProductionFilesPattern1781550000000
  implements MigrationInterface
{
  name = 'AlignClientFilesWithProductionFilesPattern1781550000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client_files" RENAME COLUMN "CLIENT_ID" TO "CLIENTE_ID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client_files" DROP COLUMN "TIPO"`,
    );
    await queryRunner.query(`DROP TYPE "public"."client_files_tipo_enum"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."client_files_tipo_enum" AS ENUM('mockup', 'producao', 'documento')`,
    );
    await queryRunner.query(
      `ALTER TABLE "client_files" ADD "TIPO" "public"."client_files_tipo_enum" NOT NULL DEFAULT 'documento'`,
    );
    await queryRunner.query(
      `ALTER TABLE "client_files" RENAME COLUMN "CLIENTE_ID" TO "CLIENT_ID"`,
    );
  }
}
