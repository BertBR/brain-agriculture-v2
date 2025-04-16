import { Farm } from '../../farms/entities/farm.entity';

export class Producer {
  id: string;
  document: string;
  name: string;
  farms?: Farm[];
  createdAt: Date;
  updatedAt: Date;
}