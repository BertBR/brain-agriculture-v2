import { Producer } from '../../producers/entities/producer.entity';
import { CropPlanting } from '../../crops/entities/planting.entity';

export class Farm {
  id: string;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  cultivableArea: number;
  vegetationArea: number;
  producerId: string;
  producer?: Producer;
  cropPlantings?: CropPlanting[];
  createdAt: Date;
  updatedAt: Date;
}