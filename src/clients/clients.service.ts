import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { ClientFile } from './entities/client-file.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateClientFileDto } from './dto/create-client-file.dto';
import { BaseEntityStatusEnum } from '../common/enums/base-entity-status.enum';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepo: Repository<Client>,
    @InjectRepository(ClientFile)
    private readonly filesRepo: Repository<ClientFile>,
  ) {}

  create(dto: CreateClientDto): Promise<Client> {
    return this.clientsRepo.save(this.clientsRepo.create(dto));
  }

  findAll(): Promise<Client[]> {
    return this.clientsRepo.find();
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientsRepo.findOne({
      where: { ID: id },
      relations: ['ARQUIVOS'],
    });
    if (!client) throw new NotFoundException('Cliente não encontrado');
    return client;
  }

  async update(id: string, dto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    Object.assign(client, dto);
    return this.clientsRepo.save(client);
  }

  async remove(id: string): Promise<void> {
    const client = await this.findOne(id);
    await this.clientsRepo.softRemove(client);
  }

  async addFile(
    clientId: string,
    dto: CreateClientFileDto,
  ): Promise<ClientFile> {
    await this.findOne(clientId);
    const file = this.filesRepo.create({ ...dto, CLIENTE_ID: clientId });
    return this.filesRepo.save(file);
  }

  findFiles(clientId: string): Promise<ClientFile[]> {
    return this.filesRepo.find({
      where: {
        CLIENTE_ID: clientId,
        STATUS: Not(BaseEntityStatusEnum.EXCLUIDO),
      },
      order: { CRIADO_EM: 'DESC' },
    });
  }

  async removeFile(fileId: string): Promise<void> {
    const file = await this.filesRepo.findOne({ where: { ID: fileId } });
    if (!file) throw new NotFoundException('Arquivo não encontrado');
    await this.filesRepo.softRemove(file);
  }
}
