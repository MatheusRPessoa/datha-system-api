import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { OrderStage } from '../../common/enums/order-stage.enum';
import { OrderPriority } from '../../common/enums/order-priority.enum';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { numericTransformer } from '../../common/transformers/numeric.transformer';
import { Client } from '../../clients/entities/client.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { OrderItem } from './order-item.entity';
import { OrderLog } from './order-log.entity';
import { ProductionFile } from './production-file.entity';
import { StageAllocation } from '../../allocations/entities/allocation.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ length: 20, unique: true })
  NUMERO: string;

  @Column({ type: 'uuid' })
  CLIENTE_ID: string;

  @ManyToOne(() => Client, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'CLIENTE_ID' })
  CLIENTE: Client;

  @Column({ length: 255 })
  TITULO: string;

  @Column({ type: 'enum', enum: OrderStage, default: OrderStage.ATENDIMENTO })
  STAGE: OrderStage;

  @Column({ length: 255 })
  RESPONSAVEL: string;

  @Column({ type: 'enum', enum: OrderPriority, default: OrderPriority.MEDIA })
  PRIORIDADE: OrderPriority;

  @Column({ type: 'date' })
  PRAZO: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: numericTransformer,
  })
  VALOR: number;

  @Column({ type: 'text', nullable: true })
  OBSERVACOES: string | null;

  @Column({
    type: 'enum',
    enum: MaterialStatus,
    default: MaterialStatus.PENDENTE,
  })
  STATUS_COMPRA_MATERIAL: MaterialStatus;

  @Column({ type: 'uuid', nullable: true })
  COMPRA_MATERIAL_FORNECEDOR_ID: string | null;

  @ManyToOne(() => Supplier, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'COMPRA_MATERIAL_FORNECEDOR_ID' })
  FORNECEDOR_COMPRA_MATERIAL: Supplier | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  COMPRA_MATERIAL_FORNECEDOR: string | null;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: numericTransformer,
  })
  COMPRA_MATERIAL_VALOR: number | null;

  @Column({ type: 'date', nullable: true })
  COMPRA_MATERIAL_DATA: string | null;

  @OneToMany(() => OrderItem, (item) => item.ORDER, { cascade: true })
  ITENS: OrderItem[];

  @OneToMany(() => OrderLog, (log) => log.ORDER)
  LOGS: OrderLog[];

  @OneToMany(() => ProductionFile, (file) => file.ORDER, { cascade: true })
  ARQUIVOS_PRODUCAO: ProductionFile[];

  @OneToMany(() => StageAllocation, (allocation) => allocation.ORDER)
  ALOCACOES: StageAllocation[];
}
