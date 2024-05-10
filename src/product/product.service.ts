import {  Injectable } from '@nestjs/common';
import { PrismaClient, Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaClient) {}
  async create(createProductDto: CreateProductDto): Promise<Product>{
    const product = await this.prisma.product.create({
      data: createProductDto,
    });
    return product;
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }


}
