import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ClientFile } from './client-file.entity';

@Entity('clients')
export class Client extends BaseEntity {
  @Column({ length: 255 })
  NOME: string;

  @Column({ length: 255 })
  CONTATO: string;

  @Column({ length: 255 })
  EMAIL: string;

  @Column({ length: 50 })
  TELEFONE: string;

  @Column({ length: 255 })
  PASTA: string;

  @OneToMany(() => ClientFile, (file: ClientFile) => file.CLIENTE, {
    cascade: true,
  })
  ARQUIVOS: ClientFile[];
}
