import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Client } from './client.entity';

@Entity('client_files')
export class ClientFile extends BaseEntity {
  @Column({ length: 255 })
  NOME: string;

  @Column({ length: 50 })
  FORMATO: string;

  @Column({ type: 'uuid' })
  CLIENTE_ID: string;

  @ManyToOne(() => Client, (client: Client) => client.ARQUIVOS, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'CLIENTE_ID' })
  CLIENTE: Client;
}
