import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHarvestDto {
  @ApiProperty({
    description: 'Nome da safra',
    example: 'Safra 2023',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Ano da safra',
    example: 2023,
  })
  @IsNumber()
  @Min(2000)
  @Max(2100)
  year: number;
}