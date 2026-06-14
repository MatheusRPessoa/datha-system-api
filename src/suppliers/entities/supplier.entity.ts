import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('suppliers')
export class Supplier extends BaseEntity {
  @Column({ length: 255 })
  NOME: string;

  @Column({ length: 100 })
  CATEGORIA: string;

  @Column({ length: 255 })
  CONTATO: string;

  @Column({ length: 50 })
  TELEFONE: string;

  @Column({ length: 255 })
  EMAIL: string;

  @Column({ default: true })
  ATIVO: boolean;
}
