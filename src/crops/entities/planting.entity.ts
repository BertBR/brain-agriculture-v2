import { Farm } from '../../farms/entities/farm.entity';
import { Crop } from './crop.entity';
import { Harvest } from './harvest.entity';

export class CropPlanting {
  id: string;
  farmId: string;
  farm?: Farm;
  cropId: string;
  crop?: Crop;
  harvestId: string;
  harvest?: Harvest;
  area: number;
  createdAt: Date;
  updatedAt: Date;
}
