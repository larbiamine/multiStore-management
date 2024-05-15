import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product, UserType } from '@prisma/client';
import { UpdateProductDto } from './dto/update-product.dto';
import { ResponseMessage } from 'src/utilities/global.types';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { UserTypesGuard } from 'src/users/user-type.guard';
import { TypeUser } from 'src/users/decorators/types.decorators';

@Controller('product')
export class ProductController {
    constructor(
        private productService: ProductService
    ) {}
    @Get()
    findAll(
        // @Query('category') categories?: string,
        // @Query('sort') sort: 'asc' | 'desc' = 'asc',
      ): Promise<Product[]> {
        return this.productService.findAll();
    }

    @UseGuards(JwtAuthGuard, UserTypesGuard)
    @TypeUser(UserType.store)
    @Post()
    createProduct(@Body() createProductDto: CreateProductDto): Promise<any> {
        return this.productService.create(createProductDto);        
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, UserTypesGuard)
    @TypeUser(UserType.store)
    update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto): Promise<ResponseMessage> {
      return this.productService.update(id, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, UserTypesGuard)
    @TypeUser(UserType.store)
    delete(@Param('id') id: number): Promise<ResponseMessage> {
      return this.productService.delete(id);
    }

}
