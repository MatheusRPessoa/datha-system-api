import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductionFilesSuppliersAndMaterialPurchase1781466728963 implements MigrationInterface {
  name = 'AddProductionFilesSuppliersAndMaterialPurchase1781466728963';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP COLUMN "ESPECIFICACOES"`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."order_production_files_status_enum" AS ENUM('ATIVO', 'INATIVO', 'EXCLUIDO')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_production_files_formato_enum" AS ENUM('PDF', 'PNG', 'JPG', 'CDR', 'AI', 'PS')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_production_files" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "STATUS" "public"."order_production_files_status_enum" NOT NULL DEFAULT 'ATIVO', "CRIADO_EM" TIMESTAMP NOT NULL DEFAULT now(), "ATUALIZADO_EM" TIMESTAMP DEFAULT now(), "EXCLUIDO_EM" TIMESTAMP, "ORDER_ID" uuid NOT NULL, "NOME" character varying(255) NOT NULL, "FORMATO" "public"."order_production_files_formato_enum" NOT NULL, CONSTRAINT "PK_order_production_files" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_production_files" ADD CONSTRAINT "FK_order_production_files_order" FOREIGN KEY ("ORDER_ID") REFERENCES "orders"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."suppliers_status_enum" AS ENUM('ATIVO', 'INATIVO', 'EXCLUIDO')`,
    );
    await queryRunner.query(
      `CREATE TABLE "suppliers" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "STATUS" "public"."suppliers_status_enum" NOT NULL DEFAULT 'ATIVO', "CRIADO_EM" TIMESTAMP NOT NULL DEFAULT now(), "ATUALIZADO_EM" TIMESTAMP DEFAULT now(), "EXCLUIDO_EM" TIMESTAMP, "NOME" character varying(255) NOT NULL, "CATEGORIA" character varying(100) NOT NULL, "CONTATO" character varying(255) NOT NULL, "TELEFONE" character varying(50) NOT NULL, "EMAIL" character varying(255) NOT NULL, "ATIVO" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_suppliers" PRIMARY KEY ("ID"))`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."orders_status_compra_material_enum" AS ENUM('pendente', 'comprado', 'cancelado')`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "STATUS_COMPRA_MATERIAL" "public"."orders_status_compra_material_enum" NOT NULL DEFAULT 'pendente'`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "COMPRA_MATERIAL_FORNECEDOR_ID" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "COMPRA_MATERIAL_FORNECEDOR" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "COMPRA_MATERIAL_VALOR" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "COMPRA_MATERIAL_DATA" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_orders_compra_material_fornecedor" FOREIGN KEY ("COMPRA_MATERIAL_FORNECEDOR_ID") REFERENCES "suppliers"("ID") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_orders_compra_material_fornecedor"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "COMPRA_MATERIAL_DATA"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "COMPRA_MATERIAL_VALOR"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "COMPRA_MATERIAL_FORNECEDOR"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "COMPRA_MATERIAL_FORNECEDOR_ID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "STATUS_COMPRA_MATERIAL"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."orders_status_compra_material_enum"`,
    );

    await queryRunner.query(`DROP TABLE "suppliers"`);
    await queryRunner.query(`DROP TYPE "public"."suppliers_status_enum"`);

    await queryRunner.query(
      `ALTER TABLE "order_production_files" DROP CONSTRAINT "FK_order_production_files_order"`,
    );
    await queryRunner.query(`DROP TABLE "order_production_files"`);
    await queryRunner.query(
      `DROP TYPE "public"."order_production_files_formato_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."order_production_files_status_enum"`,
    );

    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "ESPECIFICACOES" jsonb NOT NULL DEFAULT '[]'`,
    );
  }
}
