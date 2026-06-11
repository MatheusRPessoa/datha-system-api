import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(OmitType(CreateOrderDto, ['ITENS'] as const)) {}
