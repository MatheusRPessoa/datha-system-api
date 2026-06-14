import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsUUID, Min, ValidateIf } from 'class-validator';
import { MaterialStatus } from '../../common/enums/material-status.enum';

export class AtualizarCompraMaterialDto {
  @ApiProperty({ enum: MaterialStatus })
  @IsEnum(MaterialStatus, { message: 'Status de compra inválido' })
  STATUS: MaterialStatus;

  @ApiPropertyOptional({ description: 'Obrigatório quando STATUS = comprado' })
  @ValidateIf(
    (dto: AtualizarCompraMaterialDto) => dto.STATUS === MaterialStatus.COMPRADO,
  )
  @IsUUID('4', { message: 'Fornecedor inválido' })
  FORNECEDOR_ID?: string;

  @ApiPropertyOptional({ description: 'Obrigatório quando STATUS = comprado' })
  @ValidateIf(
    (dto: AtualizarCompraMaterialDto) => dto.STATUS === MaterialStatus.COMPRADO,
  )
  @IsNumber()
  @Min(0)
  VALOR?: number;
}
