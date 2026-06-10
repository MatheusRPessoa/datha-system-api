import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ClientFileType } from '../enums/client-file-type.enum';

export class CreateClientFileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  NOME: string;

  @ApiProperty({ enum: ClientFileType })
  @IsEnum(ClientFileType, { message: 'Tipo inválido' })
  TIPO: ClientFileType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Formato é obrigatório' })
  FORMATO: string;
}
