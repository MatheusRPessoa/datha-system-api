import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { FileFormat } from '../../common/enums/file-format.enum';

export class CreateProductionFileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  NOME: string;

  @ApiProperty({ enum: FileFormat })
  @IsEnum(FileFormat, { message: 'Formato inválido' })
  FORMATO: FileFormat;

  @ApiProperty({ description: 'Item do pedido ao qual o arquivo se refere' })
  @IsOptional()
  @IsUUID('4', { message: 'Item inválido' })
  ITEM_ID?: string;
}
