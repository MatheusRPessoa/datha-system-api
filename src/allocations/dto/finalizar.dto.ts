import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { OrderStage } from '../../common/enums/order-stage.enum';

export class FinalizarDto {
  @ApiProperty({ enum: OrderStage })
  @IsEnum(OrderStage, { message: 'Etapa inválida' })
  STAGE: OrderStage;

  @ApiProperty()
  @IsUUID('4', { message: 'Usuário inválido' })
  USER_ID: string;
}
