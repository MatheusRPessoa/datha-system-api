import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ClientFileType } from '../enums/client-file-type.enum';
import { Client } from './client.entity';

@Entity('client_files')
export class ClientFile extends BaseEntity {
  @Column({ length: 255 })
  NOME: string;

  @Column({ type: 'enum', enum: ClientFileType })
  TIPO: ClientFileType;

  @Column({ length: 50 })
  FORMATO: string;

  @Column({ type: 'uuid' })
  CLIENT_ID: string;

  @ManyToOne(() => Client, (client: Client) => client.ARQUIVOS, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'CLIENT_ID' })
  client: Client;
}
