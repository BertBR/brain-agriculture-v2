import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Farm } from '@prisma/client';

@Injectable()
export class FarmsService {
  private readonly logger = new Logger(FarmsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createFarmDto: CreateFarmDto): Promise<Farm> {
    // Verificar se o produtor existe
    const producer = await this.prisma.producer.findUnique({
      where: { id: createFarmDto.producerId },
    });

    if (!producer) {
      this.logger.warn(`Produtor não encontrado ao criar fazenda: ${createFarmDto.producerId}`);
      throw new NotFoundException(`Produtor com ID ${createFarmDto.producerId} não encontrado`);
    }

    // Validar áreas
    this.validateAreas(
      createFarmDto.totalArea,
      createFarmDto.cultivableArea,
      createFarmDto.vegetationArea,
    );

    const farm = await this.prisma.farm.create({
      data: createFarmDto,
    });

    this.logger.log(`Fazenda criada com sucesso: ${farm.id}`);
    return farm;
  }

  async findAll(
    page: number = 1, 
    limit: number = 10, 
    producerId?: string,
    state?: string,
  ): Promise<{
    data: Farm[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const where = {};
    
    if (producerId) {
      where['producerId'] = producerId;
    }
    
    if (state) {
      where['state'] = state;
    }
    
    const [farms, total] = await Promise.all([
      this.prisma.farm.findMany({
        skip,
        take: limit,
        where,
        include: {
          producer: {
            select: {
              id: true,
              name: true,
              document: true,
            },
          },
          _count: {
            select: {
              cropPlantings: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.farm.count({ where }),
    ]);

    return {
      data: farms,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Farm> {
    const farm = await this.prisma.farm.findUnique({
      where: { id },
      include: {
        producer: true,
        cropPlantings: {
          include: {
            crop: true,
            harvest: true,
          },
        },
      },
    });

    if (!farm) {
      this.logger.warn(`Fazenda não encontrada: ${id}`);
      throw new NotFoundException(`Fazenda com ID ${id} não encontrada`);
    }

    return farm;
  }

  async update(id: string, updateFarmDto: UpdateFarmDto): Promise<Farm> {
    // Verificar se a fazenda existe
    const existingFarm = await this.findOne(id);

    // Se estiver atualizando o produtor, verificar se ele existe
    if (updateFarmDto.producerId) {
      const producer = await this.prisma.producer.findUnique({
        where: { id: updateFarmDto.producerId },
      });

      if (!producer) {
        this.logger.warn(`Produtor não encontrado ao atualizar fazenda: ${updateFarmDto.producerId}`);
        throw new NotFoundException(`Produtor com ID ${updateFarmDto.producerId} não encontrado`);
      }
    }

    // Validar áreas se estiver atualizando alguma delas
    const totalArea = updateFarmDto.totalArea ?? existingFarm.totalArea;
    const cultivableArea = updateFarmDto.cultivableArea ?? existingFarm.cultivableArea;
    const vegetationArea = updateFarmDto.vegetationArea ?? existingFarm.vegetationArea;

    this.validateAreas(totalArea, cultivableArea, vegetationArea);

    const updatedFarm = await this.prisma.farm.update({
      where: { id },
      data: updateFarmDto,
    });

    this.logger.log(`Fazenda atualizada com sucesso: ${id}`);
    return updatedFarm;
  }

  async remove(id: string): Promise<void> {
    // Verificar se a fazenda existe
    await this.findOne(id);

    await this.prisma.farm.delete({
      where: { id },
    });

    this.logger.log(`Fazenda removida com sucesso: ${id}`);
  }

  private validateAreas(totalArea: number, cultivableArea: number, vegetationArea: number): void {
    // Validar que a soma das áreas não ultrapassa a área total
    const areaSum = cultivableArea + vegetationArea;
    
    if (areaSum > totalArea) {
      this.logger.warn(`Validação de área falhou: ${cultivableArea} + ${vegetationArea} > ${totalArea}`);
      throw new BadRequestException(
        'A soma da área agricultável e da área de vegetação não pode ultrapassar a área total da fazenda',
      );
    }
  }
}