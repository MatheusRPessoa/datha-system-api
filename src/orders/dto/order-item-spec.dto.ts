import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class OrderItemSpecDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Label é obrigatório' })
  label: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Valor é obrigatório' })
  valor: string;
}
