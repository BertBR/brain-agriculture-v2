import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCropDto {
  @ApiProperty({
    description: 'Nome da cultura',
    example: 'Soja',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}