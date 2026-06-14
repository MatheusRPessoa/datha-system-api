import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  NOME: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Categoria é obrigatória' })
  CATEGORIA: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Contato é obrigatório' })
  CONTATO: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  TELEFONE: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Email inválido' })
  EMAIL: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  ATIVO?: boolean;
}
