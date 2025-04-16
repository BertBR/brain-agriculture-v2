import { IsNotEmpty, IsString, Validate, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentValidator } from '../../common/validators/document.validator';

export class CreateProducerDto {
  @ApiProperty({
    description: 'CPF ou CNPJ do produtor rural',
    example: '123.456.789-00 ou 12.345.678/0001-90',
  })
  @IsNotEmpty()
  @IsString()
  @Validate(DocumentValidator)
  document: string;

  @ApiProperty({
    description: 'Nome do produtor rural',
    example: 'João da Silva',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  name: string;
}