import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderLog } from './entities/order-log.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AllocationsModule } from '../allocations/allocations.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, OrderLog]), AllocationsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
