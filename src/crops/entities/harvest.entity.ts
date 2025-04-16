import { CropPlanting } from './planting.entity';

export class Harvest {
  id: string;
  name: string;
  year: number;
  cropPlantings?: CropPlanting[];
  createdAt: Date;
  updatedAt: Date;
}