import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

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
}
