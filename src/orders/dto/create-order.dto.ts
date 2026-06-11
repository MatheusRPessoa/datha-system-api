import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { OrderPriority } from '../../common/enums/order-priority.enum';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @ApiProperty()
  @IsUUID('4', { message: 'Cliente inválido' })
  CLIENTE_ID: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Título é obrigatório' })
  TITULO: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Responsável é obrigatório' })
  RESPONSAVEL: string;

  @ApiProperty({ enum: OrderPriority })
  @IsEnum(OrderPriority, { message: 'Prioridade inválida' })
  PRIORIDADE: OrderPriority;

  @ApiProperty({ description: 'Data limite (YYYY-MM-DD)' })
  @IsDateString()
  PRAZO: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  VALOR: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  OBSERVACOES?: string;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ArrayMinSize(1, { message: 'O pedido deve conter ao menos um item' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  ITENS: CreateOrderItemDto[];
}
