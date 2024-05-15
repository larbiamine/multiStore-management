import {  BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ResponseMessage } from 'src/utilities/global.types';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaClient) {}

  async create(createProductDto: CreateProductDto): Promise<Product>{
    const product = await this.prisma.product.create({
      data: createProductDto,
    });
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ResponseMessage> {
    if ('id' in updateProductDto) {
      throw new BadRequestException('id cannot be updated');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      throw new NotFoundException('product not found');
    } else {
      await this.prisma.product.update({
        where: { id: Number(id) },
        data: updateProductDto,
      });
      return { message: 'product updated successfully' };
    }
  }

  async delete(id: number): Promise<ResponseMessage> {
    const product = await this.prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      throw new NotFoundException('product not found');
    } else {
      await this.prisma.product.delete({
        where: { id: Number(id) },
      });
      return { message: 'product deleted successfully' };
    }
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }


}
