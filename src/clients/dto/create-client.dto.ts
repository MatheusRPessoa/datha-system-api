import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateClientDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  NOME: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Contato é obrigatório' })
  CONTATO: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Email inválido' })
  EMAIL: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  TELEFONE: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Pasta é obrigatória' })
  PASTA: string;
}
