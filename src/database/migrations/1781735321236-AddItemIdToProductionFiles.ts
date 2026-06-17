import { MigrationInterface, QueryRunner } from "typeorm";

export class AddItemIdToProductionFiles1781735321236 implements MigrationInterface {
    name = 'AddItemIdToProductionFiles1781735321236'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_files" DROP CONSTRAINT "FK_0e81f52c57bee1687552219a2e9"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_orders_compra_material_fornecedor"`);
        await queryRunner.query(`ALTER TABLE "order_production_files" DROP CONSTRAINT "FK_order_production_files_order"`);
        await queryRunner.query(`ALTER TABLE "order_production_files" ADD "ITEM_ID" uuid`);
        await queryRunner.query(`ALTER TABLE "client_files" ADD CONSTRAINT "FK_72a4d1622c0816de76c89927e20" FOREIGN KEY ("CLIENTE_ID") REFERENCES "clients"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_661e070f9f353f8c19669b533fa" FOREIGN KEY ("COMPRA_MATERIAL_FORNECEDOR_ID") REFERENCES "suppliers"("ID") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_production_files" ADD CONSTRAINT "FK_b1bf794b282954c943c9fc44af4" FOREIGN KEY ("ORDER_ID") REFERENCES "orders"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_production_files" ADD CONSTRAINT "FK_eecbffb92344405559f0d53e982" FOREIGN KEY ("ITEM_ID") REFERENCES "order_items"("ID") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_production_files" DROP CONSTRAINT "FK_eecbffb92344405559f0d53e982"`);
        await queryRunner.query(`ALTER TABLE "order_production_files" DROP CONSTRAINT "FK_b1bf794b282954c943c9fc44af4"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_661e070f9f353f8c19669b533fa"`);
        await queryRunner.query(`ALTER TABLE "client_files" DROP CONSTRAINT "FK_72a4d1622c0816de76c89927e20"`);
        await queryRunner.query(`ALTER TABLE "order_production_files" DROP COLUMN "ITEM_ID"`);
        await queryRunner.query(`ALTER TABLE "order_production_files" ADD CONSTRAINT "FK_order_production_files_order" FOREIGN KEY ("ORDER_ID") REFERENCES "orders"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_orders_compra_material_fornecedor" FOREIGN KEY ("COMPRA_MATERIAL_FORNECEDOR_ID") REFERENCES "suppliers"("ID") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_files" ADD CONSTRAINT "FK_0e81f52c57bee1687552219a2e9" FOREIGN KEY ("CLIENTE_ID") REFERENCES "clients"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
