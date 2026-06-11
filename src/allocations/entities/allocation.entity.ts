import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { OrderStage } from '../../common/enums/order-stage.enum';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';

@Entity('stage_allocations')
export class StageAllocation extends BaseEntity {
  @Column({ type: 'uuid' })
  ORDER_ID: string;

  @ManyToOne(() => Order, (order) => order.ALOCACOES, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ORDER_ID' })
  order: Order;

  @Column({ type: 'enum', enum: OrderStage })
  STAGE: OrderStage;

  @Column({ type: 'uuid', nullable: true })
  ALOCADO_POR: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'ALOCADO_POR' })
  alocadoPorUser: User | null;

  @Column({ type: 'timestamp', nullable: true })
  ALOCADO_EM: Date | null;

  @Column({ type: 'uuid', nullable: true })
  FINALIZADO_POR: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'FINALIZADO_POR' })
  finalizadoPorUser: User | null;

  @Column({ type: 'timestamp', nullable: true })
  FINALIZADO_EM: Date | null;
}
