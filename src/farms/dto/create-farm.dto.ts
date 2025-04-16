import { IsNotEmpty, IsString, IsNumber, Min, IsUUID, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFarmDto {
  @ApiProperty({
    description: 'Nome da fazenda',
    example: 'Fazenda Boa Esperança',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Cidade onde está localizada a fazenda',
    example: 'Uberlândia',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Estado onde está localizada a fazenda',
    example: 'MG',
  })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({
    description: 'Área total da fazenda em hectares',
    example: 1000,
  })
  @IsNumber()
  @Min(0)
  totalArea: number;

  @ApiProperty({
    description: 'Área agricultável da fazenda em hectares',
    example: 700,
  })
  @IsNumber()
  @Min(0)
  cultivableArea: number;

  @ApiProperty({
    description: 'Área de vegetação da fazenda em hectares',
    example: 300,
  })
  @IsNumber()
  @Min(0)
  vegetationArea: number;

  @ApiProperty({
    description: 'ID do produtor dono da fazenda',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  producerId: string;
}