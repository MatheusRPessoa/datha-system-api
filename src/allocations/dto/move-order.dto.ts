import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStage } from '../../common/enums/order-stage.enum';

export class MoveOrderDto {
  @ApiProperty({ enum: OrderStage })
  @IsEnum(OrderStage, { message: 'Etapa inválida' })
  STAGE: OrderStage;
}
