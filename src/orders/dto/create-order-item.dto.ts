import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { OrderItemSpecDto } from './order-item-spec.dto';

export class CreateOrderItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  DESCRICAO: string;

  @ApiProperty()
  @IsInt()
  @Min(1, { message: 'Quantidade deve ser maior que zero' })
  QUANTIDADE: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Unidade é obrigatória' })
  UNIDADE: string;

  @ApiPropertyOptional({ type: [OrderItemSpecDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemSpecDto)
  ESPECIFICACOES?: OrderItemSpecDto[];
}
