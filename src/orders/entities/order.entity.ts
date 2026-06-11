import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { OrderStage } from '../../common/enums/order-stage.enum';
import { OrderPriority } from '../../common/enums/order-priority.enum';
import { numericTransformer } from '../../common/transformers/numeric.transformer';
import { Client } from '../../clients/entities/client.entity';
import { OrderItem } from './order-item.entity';
import { OrderLog } from './order-log.entity';
import { StageAllocation } from '../../allocations/entities/allocation.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ length: 20, unique: true })
  NUMERO: string;

  @Column({ type: 'uuid' })
  CLIENTE_ID: string;

  @ManyToOne(() => Client, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'CLIENTE_ID' })
  cliente: Client;

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

  @Column({ type: 'numeric', precision: 10, scale: 2, transformer: numericTransformer })
  VALOR: number;

  @Column({ type: 'text', nullable: true })
  OBSERVACOES: string | null;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  ITENS: OrderItem[];

  @OneToMany(() => OrderLog, (log) => log.order)
  LOGS: OrderLog[];

  @OneToMany(() => StageAllocation, (allocation) => allocation.order)
  ALOCACOES: StageAllocation[];
}
