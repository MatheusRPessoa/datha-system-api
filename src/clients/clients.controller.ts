import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateClientFileDto } from './dto/create-client-file.dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@ApiTags('clients')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo cliente' })
  create(@Body() dto: CreateClientDto) {
    return this.clientsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os clientes' })
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um cliente pelo id (com arquivos)' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um cliente' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove (soft delete) um cliente' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.remove(id);
  }

  @Get(':id/files')
  @ApiOperation({ summary: 'Lista os arquivos de um cliente' })
  findFiles(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.findFiles(id);
  }

  @Post(':id/files')
  @ApiOperation({
    summary: 'Adiciona um arquivo (mockup/produção/documento) ao cliente',
  })
  addFile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateClientFileDto,
  ) {
    return this.clientsService.addFile(id, dto);
  }

  @Delete('files/:fileId')
  @ApiOperation({ summary: 'Remove um arquivo do cliente' })
  removeFile(@Param('fileId', ParseUUIDPipe) fileId: string) {
    return this.clientsService.removeFile(fileId);
  }
}
