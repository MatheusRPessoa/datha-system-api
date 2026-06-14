import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @Column({ type: 'uuid' })
  ORDER_ID: string;

  @ManyToOne(() => Order, (order) => order.ITENS, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ORDER_ID' })
  ORDER: Order;

  @Column({ length: 255 })
  DESCRICAO: string;

  @Column({ type: 'int' })
  QUANTIDADE: number;

  @Column({ length: 50 })
  UNIDADE: string;
}
