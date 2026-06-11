import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AllocationService } from './allocation.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { OrderStage } from '../common/enums/order-stage.enum';

@ApiTags('allocations')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('allocations')
export class AllocationsController {
  constructor(private readonly allocationService: AllocationService) {}

  @Get()
  @ApiOperation({ summary: 'Lista alocações por etapa, com filtro opcional por usuário (relatório de produtividade)' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'stage', enum: OrderStage, required: false })
  findAll(@Query('userId') userId?: string, @Query('stage') stage?: OrderStage) {
    return this.allocationService.findAll({ userId, stage });
  }
}
