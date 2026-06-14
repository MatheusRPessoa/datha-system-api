import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderLog } from './entities/order-log.entity';
import { ProductionFile } from './entities/production-file.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateProductionFileDto } from './dto/create-production-file.dto';
import { AtualizarCompraMaterialDto } from './dto/atualizar-compra-material.dto';
import { OrderStage } from '../common/enums/order-stage.enum';
import {
  MaterialStatus,
  MATERIAL_STATUS_LABELS,
} from '../common/enums/material-status.enum';
import { AuthUser } from '../auth/types/jwt-payload.type';
import { AllocationService } from '../allocations/allocation.service';
import { SuppliersService } from '../suppliers/suppliers.service';

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
    @InjectRepository(ProductionFile)
    private readonly filesRepo: Repository<ProductionFile>,
    private readonly allocationService: AllocationService,
    private readonly suppliersService: SuppliersService,
  ) {}

  async create(dto: CreateOrderDto, user: AuthUser): Promise<Order> {
    await this.ensureNumeroDisponivel(dto.NUMERO);

    const order = this.ordersRepo.create({
      ...dto,
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

    await this.allocationService.alocar(
      saved.ID,
      OrderStage.ATENDIMENTO,
      user.SUB,
      user.NOME,
    );

    return this.findOne(saved.ID);
  }

  async findAll(filters: OrdersFilter): Promise<Order[]> {
    const qb = this.ordersRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.CLIENTE', 'cliente')
      .orderBy('order.CRIADO_EM', 'DESC');

    if (filters.stage) {
      qb.andWhere('order.STAGE = :stage', { stage: filters.stage });
    }
    if (filters.clienteId) {
      qb.andWhere('order.CLIENTE_ID = :clienteId', {
        clienteId: filters.clienteId,
      });
    }
    if (filters.q) {
      qb.andWhere('(order.NUMERO ILIKE :q OR order.TITULO ILIKE :q)', {
        q: `%${filters.q}%`,
      });
    }

    return qb.getMany();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepo.findOne({
      where: { ID: id },
      relations: [
        'CLIENTE',
        'ITENS',
        'LOGS',
        'ALOCACOES',
        'ARQUIVOS_PRODUCAO',
        'FORNECEDOR_COMPRA_MATERIAL',
      ],
    });
    if (!order) throw new NotFoundException('Pedido não encontrado');
    return order;
  }

  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    if (dto.NUMERO && dto.NUMERO !== order.NUMERO) {
      await this.ensureNumeroDisponivel(dto.NUMERO);
    }

    const { ITENS, ...rest } = dto;
    Object.assign(order, rest);
    await this.ordersRepo.save(order);

    if (ITENS) {
      const existingItems = await this.itemsRepo.find({
        where: { ORDER_ID: id },
      });
      if (existingItems.length) {
        await this.itemsRepo.softRemove(existingItems);
      }
      await this.itemsRepo.save(
        ITENS.map((item) => this.itemsRepo.create({ ...item, ORDER_ID: id })),
      );
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.ordersRepo.softRemove(order);
  }

  async setStage(id: string, stage: OrderStage): Promise<Order> {
    const order = await this.findOne(id);
    order.STAGE = stage;
    await this.ordersRepo.save(order);
    return this.findOne(id);
  }

  async addLog(orderId: string, quem: string, acao: string): Promise<void> {
    await this.logsRepo.save(
      this.logsRepo.create({ ORDER_ID: orderId, QUEM: quem, ACAO: acao }),
    );
  }

  async addProductionFile(
    orderId: string,
    dto: CreateProductionFileDto,
  ): Promise<Order> {
    await this.findOne(orderId);
    const file = this.filesRepo.create({ ...dto, ORDER_ID: orderId });
    await this.filesRepo.save(file);
    return this.findOne(orderId);
  }

  async removeProductionFile(fileId: string): Promise<void> {
    const file = await this.filesRepo.findOne({ where: { ID: fileId } });
    if (!file) throw new NotFoundException('Arquivo não encontrado');
    await this.filesRepo.softRemove(file);
  }

  async atualizarCompraMaterial(
    id: string,
    dto: AtualizarCompraMaterialDto,
    user: AuthUser,
  ): Promise<Order> {
    const order = await this.findOne(id);

    if (dto.STATUS === MaterialStatus.COMPRADO) {
      const fornecedor = await this.suppliersService.findOne(
        dto.FORNECEDOR_ID as string,
      );
      const valor = dto.VALOR as number;

      order.STATUS_COMPRA_MATERIAL = MaterialStatus.COMPRADO;
      order.COMPRA_MATERIAL_FORNECEDOR_ID = fornecedor.ID;
      order.COMPRA_MATERIAL_FORNECEDOR = fornecedor.NOME;
      order.COMPRA_MATERIAL_VALOR = valor;
      order.COMPRA_MATERIAL_DATA = new Date().toISOString().slice(0, 10);
      await this.ordersRepo.save(order);

      const valorFormatado = valor.toFixed(2).replace('.', ',');
      await this.addLog(
        order.ID,
        user.NOME,
        `Compra de material registrada — ${fornecedor.NOME} (R$ ${valorFormatado})`,
      );
    } else {
      order.STATUS_COMPRA_MATERIAL = dto.STATUS;
      order.COMPRA_MATERIAL_FORNECEDOR_ID = null;
      order.COMPRA_MATERIAL_FORNECEDOR = null;
      order.COMPRA_MATERIAL_VALOR = null;
      order.COMPRA_MATERIAL_DATA = null;
      await this.ordersRepo.save(order);

      await this.addLog(
        order.ID,
        user.NOME,
        `Compra de material: ${MATERIAL_STATUS_LABELS[dto.STATUS]}`,
      );
    }

    return this.findOne(id);
  }

  private async ensureNumeroDisponivel(numero: string): Promise<void> {
    const existing = await this.ordersRepo.findOne({
      where: { NUMERO: numero },
      withDeleted: true,
    });
    if (existing) {
      throw new ConflictException('Número de pedido já cadastrado');
    }
  }
}
