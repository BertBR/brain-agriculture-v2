import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { CreateCropPlantingDto } from './dto/create-crop-planting.dto';
import { UpdateCropPlantingDto } from './dto/update-crop-planting.dto';
import { Crop, Harvest, CropPlanting } from '@prisma/client';

@Injectable()
export class CropsService {
  private readonly logger = new Logger(CropsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Métodos para culturas
  async createCrop(createCropDto: CreateCropDto): Promise<Crop> {
    // Verificar se já existe uma cultura com este nome
    const existingCrop = await this.prisma.crop.findFirst({
      where: { name: createCropDto.name },
    });

    if (existingCrop) {
      this.logger.warn(`Tentativa de criar cultura com nome duplicado: ${createCropDto.name}`);
      throw new ConflictException(`Uma cultura com o nome "${createCropDto.name}" já está cadastrada`);
    }

    const crop = await this.prisma.crop.create({
      data: createCropDto,
    });

    this.logger.log(`Cultura criada com sucesso: ${crop.id}`);
    return crop;
  }

  async findAllCrops(page: number = 1, limit: number = 10): Promise<{
    data: Crop[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [crops, total] = await Promise.all([
      this.prisma.crop.findMany({
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.crop.count(),
    ]);

    return {
      data: crops,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneCrop(id: string): Promise<Crop> {
    const crop = await this.prisma.crop.findUnique({
      where: { id },
      include: {
        cropPlantings: {
          include: {
            farm: true,
            harvest: true,
          },
        },
      },
    });

    if (!crop) {
      this.logger.warn(`Cultura não encontrada: ${id}`);
      throw new NotFoundException(`Cultura com ID ${id} não encontrada`);
    }

    return crop;
  }

  async updateCrop(id: string, updateCropDto: UpdateCropDto): Promise<Crop> {
    // Verificar se a cultura existe
    await this.findOneCrop(id);

    // Se estiver atualizando o nome, verificar se já não existe
    if (updateCropDto.name) {
      const existingCrop = await this.prisma.crop.findFirst({
        where: {
          name: updateCropDto.name,
          id: { not: id },
        },
      });

      if (existingCrop) {
        this.logger.warn(`Tentativa de atualizar para nome duplicado: ${updateCropDto.name}`);
        throw new ConflictException(`Uma cultura com o nome "${updateCropDto.name}" já está cadastrada`);
      }
    }

    const updatedCrop = await this.prisma.crop.update({
      where: { id },
      data: updateCropDto,
    });

    this.logger.log(`Cultura atualizada com sucesso: ${id}`);
    return updatedCrop;
  }

  async removeCrop(id: string): Promise<void> {
    // Verificar se a cultura existe
    await this.findOneCrop(id);

    await this.prisma.crop.delete({
      where: { id },
    });

    this.logger.log(`Cultura removida com sucesso: ${id}`);
  }

  // Métodos para safras
  async createHarvest(createHarvestDto: CreateHarvestDto): Promise<Harvest> {
    // Verificar se já existe uma safra com este nome
    const existingHarvest = await this.prisma.harvest.findFirst({
      where: { name: createHarvestDto.name },
    });

    if (existingHarvest) {
      this.logger.warn(`Tentativa de criar safra com nome duplicado: ${createHarvestDto.name}`);
      throw new ConflictException(`Uma safra com o nome "${createHarvestDto.name}" já está cadastrada`);
    }

    const harvest = await this.prisma.harvest.create({
      data: createHarvestDto,
    });

    this.logger.log(`Safra criada com sucesso: ${harvest.id}`);
    return harvest;
  }

  async findAllHarvests(page: number = 1, limit: number = 10): Promise<{
    data: Harvest[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [harvests, total] = await Promise.all([
      this.prisma.harvest.findMany({
        skip,
        take: limit,
        orderBy: { year: 'desc' },
      }),
      this.prisma.harvest.count(),
    ]);

    return {
      data: harvests,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneHarvest(id: string): Promise<Harvest> {
    const harvest = await this.prisma.harvest.findUnique({
      where: { id },
      include: {
        cropPlantings: {
          include: {
            farm: true,
            crop: true,
          },
        },
      },
    });

    if (!harvest) {
      this.logger.warn(`Safra não encontrada: ${id}`);
      throw new NotFoundException(`Safra com ID ${id} não encontrada`);
    }

    return harvest;
  }

  async updateHarvest(id: string, updateHarvestDto: UpdateHarvestDto): Promise<Harvest> {
    // Verificar se a safra existe
    await this.findOneHarvest(id);

    // Se estiver atualizando o nome, verificar se já não existe
    if (updateHarvestDto.name) {
      const existingHarvest = await this.prisma.harvest.findFirst({
        where: {
          name: updateHarvestDto.name,
          id: { not: id },
        },
      });

      if (existingHarvest) {
        this.logger.warn(`Tentativa de atualizar para nome duplicado: ${updateHarvestDto.name}`);
        throw new ConflictException(`Uma safra com o nome "${updateHarvestDto.name}" já está cadastrada`);
      }
    }

    const updatedHarvest = await this.prisma.harvest.update({
      where: { id },
      data: updateHarvestDto,
    });

    this.logger.log(`Safra atualizada com sucesso: ${id}`);
    return updatedHarvest;
  }

  async removeHarvest(id: string): Promise<void> {
    // Verificar se a safra existe
    await this.findOneHarvest(id);

    await this.prisma.harvest.delete({
      where: { id },
    });

    this.logger.log(`Safra removida com sucesso: ${id}`);
  }

  // Métodos para plantios de culturas
  async createCropPlanting(createCropPlantingDto: CreateCropPlantingDto): Promise<CropPlanting> {
    // Verificar se a fazenda existe
    const farm = await this.prisma.farm.findUnique({
      where: { id: createCropPlantingDto.farmId },
    });

    if (!farm) {
      this.logger.warn(`Fazenda não encontrada ao criar plantio: ${createCropPlantingDto.farmId}`);
      throw new NotFoundException(`Fazenda com ID ${createCropPlantingDto.farmId} não encontrada`);
    }

    // Verificar se a cultura existe
    const crop = await this.prisma.crop.findUnique({
      where: { id: createCropPlantingDto.cropId },
    });

    if (!crop) {
      this.logger.warn(`Cultura não encontrada ao criar plantio: ${createCropPlantingDto.cropId}`);
      throw new NotFoundException(`Cultura com ID ${createCropPlantingDto.cropId} não encontrada`);
    }

    // Verificar se a safra existe
    const harvest = await this.prisma.harvest.findUnique({
      where: { id: createCropPlantingDto.harvestId },
    });

    if (!harvest) {
      this.logger.warn(`Safra não encontrada ao criar plantio: ${createCropPlantingDto.harvestId}`);
      throw new NotFoundException(`Safra com ID ${createCropPlantingDto.harvestId} não encontrada`);
    }

    // Verificar se a área do plantio não ultrapassa a área agricultável da fazenda
    if (createCropPlantingDto.area > farm.cultivableArea) {
      this.logger.warn(`Área de plantio (${createCropPlantingDto.area}) excede a área agricultável (${farm.cultivableArea})`);
      throw new BadRequestException(
        `A área de plantio (${createCropPlantingDto.area} ha) não pode ser maior que a área agricultável da fazenda (${farm.cultivableArea} ha)`,
      );
    }

    // Verificar se a área total de plantios para esta fazenda não ultrapassa a área agricultável
    const existingPlantings = await this.prisma.cropPlanting.findMany({
      where: {
        farmId: createCropPlantingDto.farmId,
        harvestId: createCropPlantingDto.harvestId,
      },
    });

    const totalPlantedArea = existingPlantings.reduce(
      (total, planting) => total + planting.area,
      0,
    );

    if (totalPlantedArea + createCropPlantingDto.area > farm.cultivableArea) {
      this.logger.warn(
        `Área total de plantios (${totalPlantedArea + createCropPlantingDto.area}) excede a área agricultável (${farm.cultivableArea})`,
      );
      throw new BadRequestException(
        `A área total de plantios (${totalPlantedArea + createCropPlantingDto.area} ha) não pode ser maior que a área agricultável da fazenda (${farm.cultivableArea} ha)`,
      );
    }

    const cropPlanting = await this.prisma.cropPlanting.create({
      data: createCropPlantingDto,
    });

    this.logger.log(`Plantio criado com sucesso: ${cropPlanting.id}`);
    return cropPlanting;
  }

  async findAllCropPlantings(
    page: number = 1, 
    limit: number = 10,
    farmId?: string,
    cropId?: string,
    harvestId?: string,
  ): Promise<{
    data: CropPlanting[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const where = {};
    
    if (farmId) {
      where['farmId'] = farmId;
    }
    
    if (cropId) {
      where['cropId'] = cropId;
    }

    if (harvestId) {
      where['harvestId'] = harvestId;
    }
    
    const [cropPlantings, total] = await Promise.all([
      this.prisma.cropPlanting.findMany({
        skip,
        take: limit,
        where,
        include: {
          farm: {
            select: {
              id: true,
              name: true,
              totalArea: true,
              cultivableArea: true,
            },
          },
          crop: true,
          harvest: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.cropPlanting.count({ where }),
    ]);

    return {
      data: cropPlantings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneCropPlanting(id: string): Promise<CropPlanting> {
    const cropPlanting = await this.prisma.cropPlanting.findUnique({
      where: { id },
      include: {
        farm: true,
        crop: true,
        harvest: true,
      },
    });

    if (!cropPlanting) {
      this.logger.warn(`Plantio não encontrado: ${id}`);
      throw new NotFoundException(`Plantio com ID ${id} não encontrado`);
    }

    return cropPlanting;
  }

  async updateCropPlanting(
    id: string,
    updateCropPlantingDto: UpdateCropPlantingDto,
  ): Promise<CropPlanting> {
    // Verificar se o plantio existe
    const existingPlanting = await this.findOneCropPlanting(id);

    // Se estiver atualizando a fazenda, verificar se ela existe
    let farm: { id: string; cultivableArea: number } | null = null;
    if (updateCropPlantingDto.farmId) {
      farm = await this.prisma.farm.findUnique({
        where: { id: updateCropPlantingDto.farmId },
        select: { id: true, cultivableArea: true },
      });

      if (!farm) {
        this.logger.warn(`Fazenda não encontrada ao atualizar plantio: ${updateCropPlantingDto.farmId}`);
        throw new NotFoundException(`Fazenda com ID ${updateCropPlantingDto.farmId} não encontrada`);
      }
    } else {
      farm = await this.prisma.farm.findUnique({
        where: { id: existingPlanting.farmId },
        select: { id: true, cultivableArea: true },
      });
    }

    // Se estiver atualizando a cultura, verificar se ela existe
    if (updateCropPlantingDto.cropId) {
      const crop = await this.prisma.crop.findUnique({
        where: { id: updateCropPlantingDto.cropId },
      });

      if (!crop) {
        this.logger.warn(`Cultura não encontrada ao atualizar plantio: ${updateCropPlantingDto.cropId}`);
        throw new NotFoundException(`Cultura com ID ${updateCropPlantingDto.cropId} não encontrada`);
      }
    }

    // Se estiver atualizando a safra, verificar se ela existe
    if (updateCropPlantingDto.harvestId) {
      const harvest = await this.prisma.harvest.findUnique({
        where: { id: updateCropPlantingDto.harvestId },
      });

      if (!harvest) {
        this.logger.warn(`Safra não encontrada ao atualizar plantio: ${updateCropPlantingDto.harvestId}`);
        throw new NotFoundException(`Safra com ID ${updateCropPlantingDto.harvestId} não encontrada`);
      }
    }

    // Calcular a nova área se estiver sendo atualizada, ou usar a área existente
    const newArea = updateCropPlantingDto.area ?? existingPlanting.area;
    const farmId = updateCropPlantingDto.farmId ?? existingPlanting.farmId;
    const harvestId = updateCropPlantingDto.harvestId ?? existingPlanting.harvestId;

    // Verificar se a área atualizada não ultrapassa a área agricultável da fazenda
    if (!farm) {
      this.logger.warn(`Fazenda não encontrada ao verificar área de plantio`);
      throw new NotFoundException(`Fazenda não encontrada ao verificar área de plantio`);
    }

    if (newArea > farm.cultivableArea) {
      this.logger.warn(`Área de plantio (${newArea}) excede a área agricultável (${farm.cultivableArea})`);
      throw new BadRequestException(
        `A área de plantio (${newArea} ha) não pode ser maior que a área agricultável da fazenda (${farm.cultivableArea} ha)`,
      );
    }

    // Verificar se a área total de plantios para esta fazenda não ultrapassa a área agricultável
    const existingPlantings = await this.prisma.cropPlanting.findMany({
      where: {
        farmId: farmId,
        harvestId: harvestId,
        id: { not: id }, // Excluir o plantio atual da contagem
      },
    });

    const totalPlantedArea = existingPlantings.reduce(
      (total, planting) => total + planting.area,
      0,
    );

    if (totalPlantedArea + newArea > farm.cultivableArea) {
      this.logger.warn(
        `Área total de plantios (${totalPlantedArea + newArea}) excede a área agricultável (${farm.cultivableArea})`,
      );
      throw new BadRequestException(
        `A área total de plantios (${totalPlantedArea + newArea} ha) não pode ser maior que a área agricultável da fazenda (${farm.cultivableArea} ha)`,
      );
    }

    const updatedPlanting = await this.prisma.cropPlanting.update({
      where: { id },
      data: updateCropPlantingDto,
    });

    this.logger.log(`Plantio atualizado com sucesso: ${id}`);
    return updatedPlanting;
  }

  async removeCropPlanting(id: string): Promise<void> {
    // Verificar se o plantio existe
    await this.findOneCropPlanting(id);

    await this.prisma.cropPlanting.delete({
      where: { id },
    });

    this.logger.log(`Plantio removido com sucesso: ${id}`);
  }
}
    
