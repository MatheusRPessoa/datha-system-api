import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StagesService } from './stages.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@ApiTags('stages')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('stages')
export class StagesController {
  constructor(private readonly stagesService: StagesService) {}

  @Get()
  @ApiOperation({ summary: 'Lista as etapas do fluxo de produção, em ordem' })
  findAll() {
    return this.stagesService.getAll();
  }
}
