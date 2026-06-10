import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  NOME: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Email inválido' })
  EMAIL: string;

  @ApiProperty()
  @IsString()
  @MinLength(6, { message: 'Senha deve ter ao menos 6 caracteres' })
  SENHA: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole, { message: 'Role inválida' })
  ROLE: UserRole;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Setor é obrigatório' })
  SETOR: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  ATIVO?: boolean;
}
