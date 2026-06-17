import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateOrderItemDto {
  @ApiPropertyOptional({
    description: 'Informe o ID de um item existente para preservá-lo em uma edição',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Item inválido' })
  ID?: string;

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
}
