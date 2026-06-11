import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StageAllocation } from './entities/allocation.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderLog } from '../orders/entities/order-log.entity';
import { OrderStage } from '../common/enums/order-stage.enum';
import { StagesService } from '../stages/stages.service';
import { UsersService } from '../users/users.service';
import { AuthUser } from '../auth/types/jwt-payload.type';

@Injectable()
export class AllocationService {
  constructor(
    @InjectRepository(StageAllocation)
    private readonly allocationsRepo: Repository<StageAllocation>,
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    @InjectRepository(OrderLog)
    private readonly logsRepo: Repository<OrderLog>,
    private readonly stagesService: StagesService,
    private readonly usersService: UsersService,
  ) {}

  async findAll(filters: { userId?: string; stage?: OrderStage }): Promise<StageAllocation[]> {
    const qb = this.allocationsRepo
      .createQueryBuilder('allocation')
      .leftJoinAndSelect('allocation.order', 'order')
      .orderBy('allocation.CRIADO_EM', 'DESC');

    if (filters.userId) {
      qb.andWhere('(allocation.ALOCADO_POR = :userId OR allocation.FINALIZADO_POR = :userId)', {
        userId: filters.userId,
      });
    }
    if (filters.stage) {
      qb.andWhere('allocation.STAGE = :stage', { stage: filters.stage });
    }

    return qb.getMany();
  }

  async alocar(orderId: string, stage: OrderStage, userId: string, userName?: string): Promise<StageAllocation> {
    const order = await this.findOrder(orderId);
    const name = userName ?? (await this.usersService.findOne(userId)).NOME;

    const allocation = await this.upsertAllocation(orderId, stage);
    allocation.ALOCADO_POR = userId;
    allocation.ALOCADO_EM = new Date();
    const saved = await this.allocationsRepo.save(allocation);

    await this.addLog(order.ID, name, `Alocou ${this.stagesService.getLabel(stage)}`);

    return saved;
  }

  async finalizar(orderId: string, stage: OrderStage, userId: string): Promise<StageAllocation> {
    const order = await this.findOrder(orderId);

    if (order.STAGE !== stage) {
      throw new BadRequestException('Só é possível finalizar a etapa atual do pedido');
    }

    const allocation = await this.allocationsRepo.findOne({ where: { ORDER_ID: orderId, STAGE: stage } });
    if (!allocation) {
      throw new NotFoundException('Etapa ainda não foi alocada');
    }

    const user = await this.usersService.findOne(userId);
    allocation.FINALIZADO_POR = userId;
    allocation.FINALIZADO_EM = new Date();
    const saved = await this.allocationsRepo.save(allocation);

    await this.addLog(order.ID, user.NOME, `Finalizou ${this.stagesService.getLabel(stage)}`);

    const next = this.stagesService.getNext(stage);
    if (next) {
      order.STAGE = next;
      await this.ordersRepo.save(order);
      await this.upsertAllocation(orderId, next);
      await this.addLog(order.ID, user.NOME, `Pedido movido para ${this.stagesService.getLabel(next)}`);
    }

    return saved;
  }

  async move(orderId: string, stage: OrderStage, user: AuthUser): Promise<StageAllocation> {
    const order = await this.findOrder(orderId);

    order.STAGE = stage;
    await this.ordersRepo.save(order);

    const allocation = await this.upsertAllocation(orderId, stage);
    await this.addLog(order.ID, user.NOME, `Moveu o pedido para ${this.stagesService.getLabel(stage)}`);

    return allocation;
  }

  private async findOrder(orderId: string): Promise<Order> {
    const order = await this.ordersRepo.findOne({ where: { ID: orderId } });
    if (!order) throw new NotFoundException('Pedido não encontrado');
    return order;
  }

  private async upsertAllocation(orderId: string, stage: OrderStage): Promise<StageAllocation> {
    let allocation = await this.allocationsRepo.findOne({ where: { ORDER_ID: orderId, STAGE: stage } });
    if (!allocation) {
      allocation = this.allocationsRepo.create({ ORDER_ID: orderId, STAGE: stage });
      allocation = await this.allocationsRepo.save(allocation);
    }
    return allocation;
  }

  private async addLog(orderId: string, quem: string, acao: string): Promise<void> {
    await this.logsRepo.save(this.logsRepo.create({ ORDER_ID: orderId, QUEM: quem, ACAO: acao }));
  }
}
