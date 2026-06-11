import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderLog } from './entities/order-log.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStage } from '../common/enums/order-stage.enum';
import { AuthUser } from '../auth/types/jwt-payload.type';
import { AllocationService } from '../allocations/allocation.service';

export type OrdersFilter = {
  stage?: OrderStage;
  clienteId?: string;
  q?: string;
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly itemsRepo: Repository<OrderItem>,
    @InjectRepository(OrderLog)
    private readonly logsRepo: Repository<OrderLog>,
    private readonly allocationService: AllocationService,
  ) {}

  async create(dto: CreateOrderDto, user: AuthUser): Promise<Order> {
    const numero = await this.generateNumero();

    const order = this.ordersRepo.create({
      ...dto,
      NUMERO: numero,
      ITENS: dto.ITENS.map((item) => this.itemsRepo.create(item)),
    });
    const saved = await this.ordersRepo.save(order);

    await this.logsRepo.save(
      this.logsRepo.create({
        ORDER_ID: saved.ID,
        QUEM: user.NOME,
        ACAO: `Criou o pedido ${saved.NUMERO}`,
      }),
    );

    await this.allocationService.alocar(saved.ID, OrderStage.ATENDIMENTO, user.SUB, user.NOME);

    return this.findOne(saved.ID);
  }

  async findAll(filters: OrdersFilter): Promise<Order[]> {
    const qb = this.ordersRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.cliente', 'cliente')
      .orderBy('order.CRIADO_EM', 'DESC');

    if (filters.stage) {
      qb.andWhere('order.STAGE = :stage', { stage: filters.stage });
    }
    if (filters.clienteId) {
      qb.andWhere('order.CLIENTE_ID = :clienteId', { clienteId: filters.clienteId });
    }
    if (filters.q) {
      qb.andWhere('(order.NUMERO ILIKE :q OR order.TITULO ILIKE :q)', { q: `%${filters.q}%` });
    }

    return qb.getMany();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepo.findOne({
      where: { ID: id },
      relations: ['cliente', 'ITENS', 'LOGS', 'ALOCACOES'],
    });
    if (!order) throw new NotFoundException('Pedido não encontrado');
    return order;
  }

  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, dto);
    await this.ordersRepo.save(order);
    return this.findOne(id);
  }

  async setStage(id: string, stage: OrderStage): Promise<Order> {
    const order = await this.findOne(id);
    order.STAGE = stage;
    await this.ordersRepo.save(order);
    return this.findOne(id);
  }

  async addLog(orderId: string, quem: string, acao: string): Promise<void> {
    await this.logsRepo.save(this.logsRepo.create({ ORDER_ID: orderId, QUEM: quem, ACAO: acao }));
  }

  private async generateNumero(): Promise<string> {
    const last = await this.ordersRepo
      .createQueryBuilder('order')
      .withDeleted()
      .orderBy('order.CRIADO_EM', 'DESC')
      .getOne();

    const lastNumber = last ? parseInt(last.NUMERO.replace('#', ''), 10) : 1000;
    return `#${lastNumber + 1}`;
  }
}
