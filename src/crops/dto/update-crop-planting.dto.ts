import { PartialType } from '@nestjs/swagger';
import { CreateCropPlantingDto } from './create-crop-planting.dto';

export class UpdateCropPlantingDto extends PartialType(CreateCropPlantingDto) {}