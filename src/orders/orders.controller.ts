import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { AuthUser } from '../auth/types/jwt-payload.type';
import { OrderStage } from '../common/enums/order-stage.enum';
import { AllocationService } from '../allocations/allocation.service';
import { AlocarDto } from '../allocations/dto/alocar.dto';
import { FinalizarDto } from '../allocations/dto/finalizar.dto';
import { MoveOrderDto } from '../allocations/dto/move-order.dto';

@ApiTags('orders')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly allocationService: AllocationService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista os pedidos (filtros opcionais)' })
  @ApiQuery({ name: 'stage', enum: OrderStage, required: false })
  @ApiQuery({ name: 'clienteId', required: false })
  @ApiQuery({ name: 'q', required: false })
  findAll(
    @Query('stage') stage?: OrderStage,
    @Query('clienteId') clienteId?: string,
    @Query('q') q?: string,
  ) {
    return this.ordersService.findAll({ stage, clienteId, q });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um pedido pelo id (com itens, alocações e logs)' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cria um novo pedido (gera número e aloca atendimento)' })
  create(@Body() dto: CreateOrderDto, @Req() req: { user: AuthUser }) {
    return this.ordersService.create(dto, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um pedido' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(id, dto);
  }

  @Post(':id/alocar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Aloca um colaborador a uma etapa do pedido' })
  async alocar(@Param('id', ParseUUIDPipe) id: string, @Body() dto: AlocarDto) {
    await this.allocationService.alocar(id, dto.STAGE, dto.USER_ID);
    return this.ordersService.findOne(id);
  }

  @Post(':id/finalizar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Finaliza a etapa atual do pedido (e pré-aloca a próxima, se houver)' })
  async finalizar(@Param('id', ParseUUIDPipe) id: string, @Body() dto: FinalizarDto) {
    await this.allocationService.finalizar(id, dto.STAGE, dto.USER_ID);
    return this.ordersService.findOne(id);
  }

  @Post(':id/move')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Move o pedido para outra etapa do Kanban' })
  async move(@Param('id', ParseUUIDPipe) id: string, @Body() dto: MoveOrderDto, @Req() req: { user: AuthUser }) {
    await this.allocationService.move(id, dto.STAGE, req.user);
    return this.ordersService.findOne(id);
  }
}
