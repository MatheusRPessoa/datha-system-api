import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { FileFormat } from '../../common/enums/file-format.enum';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';

@Entity('order_production_files')
export class ProductionFile extends BaseEntity {
  @Column({ type: 'uuid' })
  ORDER_ID: string;

  @ManyToOne(() => Order, (order) => order.ARQUIVOS_PRODUCAO, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ORDER_ID' })
  ORDER: Order;

  @Column({ length: 255 })
  NOME: string;

  @Column({ type: 'enum', enum: FileFormat })
  FORMATO: FileFormat;

  @Column({ type: 'uuid', nullable: true })
  ITEM_ID: string | null;

  @ManyToOne(() => OrderItem, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'ITEM_ID' })
  ITEM: OrderItem | null;
}
