import { IsNotEmpty, IsUUID, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCropPlantingDto {
  @ApiProperty({
    description: 'ID da fazenda',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  farmId: string;

  @ApiProperty({
    description: 'ID da cultura',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  cropId: string;

  @ApiProperty({
    description: 'ID da safra',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  harvestId: string;

  @ApiProperty({
    description: 'Área plantada em hectares',
    example: 150,
  })
  @IsNumber()
  @Min(0)
  area: number;
}