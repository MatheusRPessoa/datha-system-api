import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateClientsAndClientFiles1781094372406 implements MigrationInterface {
    name = 'CreateClientsAndClientFiles1781094372406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."client_files_status_enum" AS ENUM('ATIVO', 'INATIVO', 'EXCLUIDO')`);
        await queryRunner.query(`CREATE TYPE "public"."client_files_tipo_enum" AS ENUM('mockup', 'producao', 'documento')`);
        await queryRunner.query(`CREATE TABLE "client_files" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "STATUS" "public"."client_files_status_enum" NOT NULL DEFAULT 'ATIVO', "CRIADO_EM" TIMESTAMP NOT NULL DEFAULT now(), "ATUALIZADO_EM" TIMESTAMP DEFAULT now(), "EXCLUIDO_EM" TIMESTAMP, "NOME" character varying(255) NOT NULL, "TIPO" "public"."client_files_tipo_enum" NOT NULL, "FORMATO" character varying(50) NOT NULL, "CLIENT_ID" uuid NOT NULL, CONSTRAINT "PK_bca05d184ccff2a1a103fc1b539" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TYPE "public"."clients_status_enum" AS ENUM('ATIVO', 'INATIVO', 'EXCLUIDO')`);
        await queryRunner.query(`CREATE TABLE "clients" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "STATUS" "public"."clients_status_enum" NOT NULL DEFAULT 'ATIVO', "CRIADO_EM" TIMESTAMP NOT NULL DEFAULT now(), "ATUALIZADO_EM" TIMESTAMP DEFAULT now(), "EXCLUIDO_EM" TIMESTAMP, "NOME" character varying(255) NOT NULL, "CONTATO" character varying(255) NOT NULL, "EMAIL" character varying(255) NOT NULL, "TELEFONE" character varying(50) NOT NULL, "PASTA" character varying(255) NOT NULL, CONSTRAINT "PK_1de6b53611a20b43d7eb7ab9d12" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`ALTER TABLE "client_files" ADD CONSTRAINT "FK_0e81f52c57bee1687552219a2e9" FOREIGN KEY ("CLIENT_ID") REFERENCES "clients"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_files" DROP CONSTRAINT "FK_0e81f52c57bee1687552219a2e9"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TYPE "public"."clients_status_enum"`);
        await queryRunner.query(`DROP TABLE "client_files"`);
        await queryRunner.query(`DROP TYPE "public"."client_files_tipo_enum"`);
        await queryRunner.query(`DROP TYPE "public"."client_files_status_enum"`);
    }

}
