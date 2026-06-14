import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StageAllocation } from './entities/allocation.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderLog } from '../orders/entities/order-log.entity';
import { AllocationService } from './allocation.service';
import { AllocationsController } from './allocations.controller';
import { StagesModule } from '../stages/stages.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StageAllocation, Order, OrderLog]),
    StagesModule,
    UsersModule,
  ],
  controllers: [AllocationsController],
  providers: [AllocationService],
  exports: [AllocationService],
})
export class AllocationsModule {}
