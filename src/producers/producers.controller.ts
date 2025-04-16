import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  Logger,
} from '@nestjs/common';
import { ProducersService } from './producers.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('produtores')
@Controller('producers')
export class ProducersController {
  private readonly logger = new Logger(ProducersController.name);
  
  constructor(private readonly producersService: ProducersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo produtor rural' })
  @ApiResponse({ status: 201, description: 'Produtor criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'CPF/CNPJ já cadastrado' })
  async create(@Body() createProducerDto: CreateProducerDto) {
    this.logger.log(`Criando produtor: ${JSON.stringify(createProducerDto)}`);
    return this.producersService.create(createProducerDto);
  }
  
  @Get()
  @ApiOperation({ summary: 'Listar todos os produtores rurais' })
  @ApiResponse({ status: 200, description: 'Lista de produtores' })
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    this.logger.log(`Listando produtores - página: ${page}, limite: ${limit}`);
    return this.producersService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um produtor rural pelo ID' })
  @ApiResponse({ status: 200, description: 'Produtor encontrado' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Buscando produtor com ID: ${id}`);
    return this.producersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um produtor rural' })
  @ApiResponse({ status: 200, description: 'Produtor atualizado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  @ApiResponse({ status: 409, description: 'CPF/CNPJ já cadastrado' })
  async update(
    @Param('id') id: string,
    @Body() updateProducerDto: UpdateProducerDto,
  ) {
    this.logger.log(`Atualizando produtor ${id}: ${JSON.stringify(updateProducerDto)}`);
    return this.producersService.update(id, updateProducerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir um produtor rural' })
  @ApiResponse({ status: 204, description: 'Produtor excluído' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  async remove(@Param('id') id: string) {
    this.logger.log(`Excluindo produtor com ID: ${id}`);
    await this.producersService.remove(id);
  }
}