import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { UserRole } from '../../common/enums/user-role.enum';

@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 255 })
  NOME: string;

  @Column({ length: 255, unique: true })
  EMAIL: string;

  @Column({ length: 255, select: false })
  SENHA: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.ATENDIMENTO })
  ROLE: UserRole;

  @Column({ length: 100 })
  SETOR: string;

  @Column({ default: true })
  ATIVO: boolean;
}
