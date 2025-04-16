import { CropPlanting } from './planting.entity';

export class Crop {
  id: string;
  name: string;
  cropPlantings?: CropPlanting[];
  createdAt: Date;
  updatedAt: Date;
}