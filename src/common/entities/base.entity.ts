import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { BaseEntityStatusEnum } from '../enums/base-entity-status.enum';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  ID: string;

  @Column({ type: 'enum', enum: BaseEntityStatusEnum, default: BaseEntityStatusEnum.ATIVO })
  STATUS: BaseEntityStatusEnum;

  @CreateDateColumn({ type: 'timestamp' })
  CRIADO_EM: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  ATUALIZADO_EM: Date | null;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  EXCLUIDO_EM: Date | null;
}
