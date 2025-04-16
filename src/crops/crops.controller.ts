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
import { CropsService } from './crops.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { CreateCropPlantingDto } from './dto/create-crop-planting.dto';
import { UpdateCropPlantingDto } from './dto/update-crop-planting.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('culturas')
@Controller('crops')
export class CropsController {
  private readonly logger = new Logger(CropsController.name);
  
  constructor(private readonly cropsService: CropsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova cultura' })
  @ApiResponse({ status: 201, description: 'Cultura criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Cultura já cadastrada' })
  async createCrop(@Body() createCropDto: CreateCropDto) {
    this.logger.log(`Criando cultura: ${JSON.stringify(createCropDto)}`);
    return this.cropsService.createCrop(createCropDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as culturas' })
  @ApiResponse({ status: 200, description: 'Lista de culturas' })
  async findAllCrops(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    this.logger.log(`Listando culturas - página: ${page}, limite: ${limit}`);
    return this.cropsService.findAllCrops(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma cultura pelo ID' })
  @ApiResponse({ status: 200, description: 'Cultura encontrada' })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada' })
  async findOneCrop(@Param('id') id: string) {
    this.logger.log(`Buscando cultura com ID: ${id}`);
    return this.cropsService.findOneCrop(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma cultura' })
  @ApiResponse({ status: 200, description: 'Cultura atualizada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada' })
  @ApiResponse({ status: 409, description: 'Nome da cultura já cadastrado' })
  async updateCrop(
    @Param('id') id: string,
    @Body() updateCropDto: UpdateCropDto,
  ) {
    this.logger.log(`Atualizando cultura ${id}: ${JSON.stringify(updateCropDto)}`);
    return this.cropsService.updateCrop(id, updateCropDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir uma cultura' })
  @ApiResponse({ status: 204, description: 'Cultura excluída' })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada' })
  async removeCrop(@Param('id') id: string) {
    this.logger.log(`Excluindo cultura com ID: ${id}`);
    await this.cropsService.removeCrop(id);
  }

  @Post('harvests')
  @ApiOperation({ summary: 'Criar uma nova safra' })
  @ApiResponse({ status: 201, description: 'Safra criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Safra já cadastrada' })
  async createHarvest(@Body() createHarvestDto: CreateHarvestDto) {
    this.logger.log(`Criando safra: ${JSON.stringify(createHarvestDto)}`);
    return this.cropsService.createHarvest(createHarvestDto);
  }

  @Get('harvests')
  @ApiOperation({ summary: 'Listar todas as safras' })
  @ApiResponse({ status: 200, description: 'Lista de safras' })
  async findAllHarvests(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    this.logger.log(`Listando safras - página: ${page}, limite: ${limit}`);
    return this.cropsService.findAllHarvests(page, limit);
  }

  @Get('harvests/:id')
  @ApiOperation({ summary: 'Buscar uma safra pelo ID' })
  @ApiResponse({ status: 200, description: 'Safra encontrada' })
  @ApiResponse({ status: 404, description: 'Safra não encontrada' })
  async findOneHarvest(@Param('id') id: string) {
    this.logger.log(`Buscando safra com ID: ${id}`);
    return this.cropsService.findOneHarvest(id);
  }

  @Patch('harvests/:id')
  @ApiOperation({ summary: 'Atualizar uma safra' })
  @ApiResponse({ status: 200, description: 'Safra atualizada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Safra não encontrada' })
  @ApiResponse({ status: 409, description: 'Nome da safra já cadastrado' })
  async updateHarvest(
    @Param('id') id: string,
    @Body() updateHarvestDto: UpdateHarvestDto,
  ) {
    this.logger.log(`Atualizando safra ${id}: ${JSON.stringify(updateHarvestDto)}`);
    return this.cropsService.updateHarvest(id, updateHarvestDto);
  }

  @Delete('harvests/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir uma safra' })
  @ApiResponse({ status: 204, description: 'Safra excluída' })
  @ApiResponse({ status: 404, description: 'Safra não encontrada' })
  async removeHarvest(@Param('id') id: string) {
    this.logger.log(`Excluindo safra com ID: ${id}`);
    await this.cropsService.removeHarvest(id);
  }

  @Post('plantings')
  @ApiOperation({ summary: 'Registrar um novo plantio de cultura' })
  @ApiResponse({ status: 201, description: 'Plantio registrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Fazenda, cultura ou safra não encontrada' })
  async createCropPlanting(@Body() createCropPlantingDto: CreateCropPlantingDto) {
    this.logger.log(`Criando plantio: ${JSON.stringify(createCropPlantingDto)}`);
    return this.cropsService.createCropPlanting(createCropPlantingDto);
  }

  @Get('plantings')
  @ApiOperation({ summary: 'Listar todos os plantios de culturas' })
  @ApiResponse({ status: 200, description: 'Lista de plantios' })
  async findAllCropPlantings(
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 10,
    @Query('farmId') farmId?: string,
    @Query('cropId') cropId?: string,
    @Query('harvestId') harvestId?: string,
  ) {
    this.logger.log(`Listando plantios - página: ${page}, limite: ${limit}`);
    return this.cropsService.findAllCropPlantings(page, limit, farmId, cropId, harvestId);
  }

  @Get('plantings/:id')
  @ApiOperation({ summary: 'Buscar um plantio pelo ID' })
  @ApiResponse({ status: 200, description: 'Plantio encontrado' })
  @ApiResponse({ status: 404, description: 'Plantio não encontrado' })
  async findOneCropPlanting(@Param('id') id: string) {
    this.logger.log(`Buscando plantio com ID: ${id}`);
    return this.cropsService.findOneCropPlanting(id);
  }

  @Patch('plantings/:id')
  @ApiOperation({ summary: 'Atualizar um plantio' })
  @ApiResponse({ status: 200, description: 'Plantio atualizado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Plantio não encontrado' })
  async updateCropPlanting(
    @Param('id') id: string,
    @Body() updateCropPlantingDto: UpdateCropPlantingDto,
  ) {
    this.logger.log(`Atualizando plantio ${id}: ${JSON.stringify(updateCropPlantingDto)}`);
    return this.cropsService.updateCropPlanting(id, updateCropPlantingDto);
  }

  @Delete('plantings/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir um plantio' })
  @ApiResponse({ status: 204, description: 'Plantio excluído' })
  @ApiResponse({ status: 404, description: 'Plantio não encontrado' })
  async removeCropPlanting(@Param('id') id: string) {
    this.logger.log(`Excluindo plantio com ID: ${id}`);
    await this.cropsService.removeCropPlanting(id);
  }
}