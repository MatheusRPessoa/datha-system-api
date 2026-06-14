import { MigrationInterface, QueryRunner } from 'typeorm';

export class NomeDaMigration1781014812297 implements MigrationInterface {
  name = 'NomeDaMigration1781014812297';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum" AS ENUM('ATIVO', 'INATIVO', 'EXCLUIDO')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'atendimento', 'producao', 'acabamento', 'entrega')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "STATUS" "public"."users_status_enum" NOT NULL DEFAULT 'ATIVO', "CRIADO_EM" TIMESTAMP NOT NULL DEFAULT now(), "ATUALIZADO_EM" TIMESTAMP DEFAULT now(), "EXCLUIDO_EM" TIMESTAMP, "NOME" character varying(255) NOT NULL, "EMAIL" character varying(255) NOT NULL, "SENHA" character varying(255) NOT NULL, "ROLE" "public"."users_role_enum" NOT NULL DEFAULT 'atendimento', "SETOR" character varying(100) NOT NULL, "ATIVO" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_9d86b1f4a13ac660473a9f8324a" UNIQUE ("EMAIL"), CONSTRAINT "PK_5763954075431ddd0821cd906da" PRIMARY KEY ("ID"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
  }
}
