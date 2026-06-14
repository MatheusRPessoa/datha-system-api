import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Order } from './order.entity';

@Entity('order_logs')
export class OrderLog extends BaseEntity {
  @Column({ type: 'uuid' })
  ORDER_ID: string;

  @ManyToOne(() => Order, (order) => order.LOGS, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ORDER_ID' })
  ORDER: Order;

  @Column({ length: 255 })
  QUEM: string;

  @Column({ length: 255 })
  ACAO: string;
}
