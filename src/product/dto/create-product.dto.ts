import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsNumber()
  orderId?: number;
}

