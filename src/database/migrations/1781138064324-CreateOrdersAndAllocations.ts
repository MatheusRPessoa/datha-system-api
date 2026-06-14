import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrdersAndAllocations1781138064324 implements MigrationInterface {
  name = 'CreateOrdersAndAllocations1781138064324';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."order_items_status_enum" AS ENUM('ATIVO', 'INATIVO', 'EXCLUIDO')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_items" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "STATUS" "public"."order_items_status_enum" NOT NULL DEFAULT 'ATIVO', "CRIADO_EM" TIMESTAMP NOT NULL DEFAULT now(), "ATUALIZADO_EM" TIMESTAMP DEFAULT now(), "EXCLUIDO_EM" TIMESTAMP, "ORDER_ID" uuid NOT NULL, "DESCRICAO" character varying(255) NOT NULL, "QUANTIDADE" integer NOT NULL, "UNIDADE" character varying(50) NOT NULL, "ESPECIFICACOES" jsonb NOT NULL DEFAULT '[]', CONSTRAINT "PK_e8ced95c56cffc41d8e6430021a" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_logs_status_enum" AS ENUM('ATIVO', 'INATIVO', 'EXCLUIDO')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_logs" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "STATUS" "public"."order_logs_status_enum" NOT NULL DEFAULT 'ATIVO', "CRIADO_EM" TIMESTAMP NOT NULL DEFAULT now(), "ATUALIZADO_EM" TIMESTAMP DEFAULT now(), "EXCLUIDO_EM" TIMESTAMP, "ORDER_ID" uuid NOT NULL, "QUEM" character varying(255) NOT NULL, "ACAO" character varying(255) NOT NULL, CONSTRAINT "PK_e60cddc4ac8bf2d6954f4e5d5e4" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."stage_allocations_status_enum" AS ENUM('ATIVO', 'INATIVO', 'EXCLUIDO')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."stage_allocations_stage_enum" AS ENUM('atendimento', 'montagem', 'impressao', 'producao', 'acabamento', 'entrega')`,
    );
    await queryRunner.query(
      `CREATE TABLE "stage_allocations" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "STATUS" "public"."stage_allocations_status_enum" NOT NULL DEFAULT 'ATIVO', "CRIADO_EM" TIMESTAMP NOT NULL DEFAULT now(), "ATUALIZADO_EM" TIMESTAMP DEFAULT now(), "EXCLUIDO_EM" TIMESTAMP, "ORDER_ID" uuid NOT NULL, "STAGE" "public"."stage_allocations_stage_enum" NOT NULL, "ALOCADO_POR" uuid, "ALOCADO_EM" TIMESTAMP, "FINALIZADO_POR" uuid, "FINALIZADO_EM" TIMESTAMP, CONSTRAINT "PK_c3f3b2ea9d6f92065db67ebecb5" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_status_enum" AS ENUM('ATIVO', 'INATIVO', 'EXCLUIDO')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_stage_enum" AS ENUM('atendimento', 'montagem', 'impressao', 'producao', 'acabamento', 'entrega')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_prioridade_enum" AS ENUM('baixa', 'media', 'alta')`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "STATUS" "public"."orders_status_enum" NOT NULL DEFAULT 'ATIVO', "CRIADO_EM" TIMESTAMP NOT NULL DEFAULT now(), "ATUALIZADO_EM" TIMESTAMP DEFAULT now(), "EXCLUIDO_EM" TIMESTAMP, "NUMERO" character varying(20) NOT NULL, "CLIENTE_ID" uuid NOT NULL, "TITULO" character varying(255) NOT NULL, "STAGE" "public"."orders_stage_enum" NOT NULL DEFAULT 'atendimento', "RESPONSAVEL" character varying(255) NOT NULL, "PRIORIDADE" "public"."orders_prioridade_enum" NOT NULL DEFAULT 'media', "PRAZO" date NOT NULL, "VALOR" numeric(10,2) NOT NULL, "OBSERVACOES" text, CONSTRAINT "UQ_8a805d0486fc812acfc0e625645" UNIQUE ("NUMERO"), CONSTRAINT "PK_4e9a14bb55cfc3244daff8684e8" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_29dd48eac99961df11e24184d07" FOREIGN KEY ("ORDER_ID") REFERENCES "orders"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_logs" ADD CONSTRAINT "FK_a58d4722cd87b94b80d02794fed" FOREIGN KEY ("ORDER_ID") REFERENCES "orders"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stage_allocations" ADD CONSTRAINT "FK_26b400be88637fdf49f5ac70f00" FOREIGN KEY ("ORDER_ID") REFERENCES "orders"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stage_allocations" ADD CONSTRAINT "FK_a289de442f0ddb58c525c885e4b" FOREIGN KEY ("ALOCADO_POR") REFERENCES "users"("ID") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stage_allocations" ADD CONSTRAINT "FK_0fe3d673e83c1fd7258d30dc9a5" FOREIGN KEY ("FINALIZADO_POR") REFERENCES "users"("ID") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_3eaa17d4adca4b55ec8ca44a6bc" FOREIGN KEY ("CLIENTE_ID") REFERENCES "clients"("ID") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_3eaa17d4adca4b55ec8ca44a6bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stage_allocations" DROP CONSTRAINT "FK_0fe3d673e83c1fd7258d30dc9a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stage_allocations" DROP CONSTRAINT "FK_a289de442f0ddb58c525c885e4b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stage_allocations" DROP CONSTRAINT "FK_26b400be88637fdf49f5ac70f00"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_logs" DROP CONSTRAINT "FK_a58d4722cd87b94b80d02794fed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_29dd48eac99961df11e24184d07"`,
    );
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TYPE "public"."orders_prioridade_enum"`);
    await queryRunner.query(`DROP TYPE "public"."orders_stage_enum"`);
    await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
    await queryRunner.query(`DROP TABLE "stage_allocations"`);
    await queryRunner.query(
      `DROP TYPE "public"."stage_allocations_stage_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."stage_allocations_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "order_logs"`);
    await queryRunner.query(`DROP TYPE "public"."order_logs_status_enum"`);
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(`DROP TYPE "public"."order_items_status_enum"`);
  }
}
