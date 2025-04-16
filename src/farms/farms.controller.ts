import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FarmsService } from './farms.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('fazendas')
@Controller('farms')
export class FarmsController {
  private readonly logger = new Logger(FarmsController.name);
  
  constructor(private readonly farmsService: FarmsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova fazenda' })
  @ApiResponse({ status: 201, description: 'Fazenda criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  async create(@Body() createFarmDto: CreateFarmDto) {
    this.logger.log(`Criando fazenda: ${JSON.stringify(createFarmDto)}`);
    return this.farmsService.create(createFarmDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as fazendas' })
  @ApiResponse({ status: 200, description: 'Lista de fazendas' })
  async findAll(
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 10,
    @Query('producerId') producerId?: string,
    @Query('state') state?: string,
  ) {
    this.logger.log(`Listando fazendas - página: ${page}, limite: ${limit}, produtor: ${producerId}, estado: ${state}`);
    return this.farmsService.findAll(page, limit, producerId, state);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma fazenda pelo ID' })
  @ApiResponse({ status: 200, description: 'Fazenda encontrada' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada' })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Buscando fazenda com ID: ${id}`);
    return this.farmsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma fazenda' })
  @ApiResponse({ status: 200, description: 'Fazenda atualizada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada' })
  async update(
    @Param('id') id: string,
    @Body() updateFarmDto: UpdateFarmDto,
  ) {
    this.logger.log(`Atualizando fazenda ${id}: ${JSON.stringify(updateFarmDto)}`);
    return this.farmsService.update(id, updateFarmDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir uma fazenda' })
  @ApiResponse({ status: 204, description: 'Fazenda excluída' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada' })
  async remove(@Param('id') id: string) {
    this.logger.log(`Excluindo fazenda com ID: ${id}`);
    await this.farmsService.remove(id);
  }
}