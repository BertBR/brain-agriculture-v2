import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Producer } from '@prisma/client';

@Injectable()
export class ProducersService {
  private readonly logger = new Logger(ProducersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createProducerDto: CreateProducerDto): Promise<Producer> {
    // Verificar se já existe um produtor com este documento
    const existingProducer = await this.prisma.producer.findUnique({
      where: { document: createProducerDto.document },
    });

    if (existingProducer) {
      this.logger.warn(`Tentativa de criar produtor com documento duplicado: ${createProducerDto.document}`);
      throw new ConflictException('Um produtor com este CPF/CNPJ já está cadastrado');
    }

    const producer = await this.prisma.producer.create({
      data: createProducerDto,
    });

    this.logger.log(`Produtor criado com sucesso: ${producer.id}`);
    return producer;
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{
    data: Producer[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [producers, total] = await Promise.all([
      this.prisma.producer.findMany({
        skip,
        take: limit,
        include: {
          farms: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.producer.count(),
    ]);

    return {
      data: producers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Producer> {
    const producer = await this.prisma.producer.findUnique({
      where: { id },
      include: {
        farms: true,
      },
    });

    if (!producer) {
      this.logger.warn(`Produtor não encontrado: ${id}`);
      throw new NotFoundException(`Produtor com ID ${id} não encontrado`);
    }

    return producer;
  }

  async update(id: string, updateProducerDto: UpdateProducerDto): Promise<Producer> {
    // Verificar se o produtor existe
    await this.findOne(id);

    // Se estiver atualizando o documento, verificar se já não está em uso
    if (updateProducerDto.document) {
      const existingProducer = await this.prisma.producer.findFirst({
        where: {
          document: updateProducerDto.document,
          id: { not: id },
        },
      });

      if (existingProducer) {
        this.logger.warn(`Tentativa de atualizar para documento duplicado: ${updateProducerDto.document}`);
        throw new ConflictException('Um produtor com este CPF/CNPJ já está cadastrado');
      }
    }

    const updatedProducer = await this.prisma.producer.update({
      where: { id },
      data: updateProducerDto,
    });

    this.logger.log(`Produtor atualizado com sucesso: ${id}`);
    return updatedProducer;
  }

  async remove(id: string): Promise<void> {
    // Verificar se o produtor existe
    await this.findOne(id);

    await this.prisma.producer.delete({
      where: { id },
    });

    this.logger.log(`Produtor removido com sucesso: ${id}`);
  }
}