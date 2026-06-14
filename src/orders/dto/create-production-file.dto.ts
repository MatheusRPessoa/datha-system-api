import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FileFormat } from '../../common/enums/file-format.enum';

export class CreateProductionFileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  NOME: string;

  @ApiProperty({ enum: FileFormat })
  @IsEnum(FileFormat, { message: 'Formato inválido' })
  FORMATO: FileFormat;
}
