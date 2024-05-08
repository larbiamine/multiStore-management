import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '@prisma/client';

@Controller('product')
export class ProductController {
    constructor(
        private productService: ProductService
    ) {}
    @Get()
    getProducts(): Promise< Product[]> {

        return this.productService.findAll();
        
    }

    @Post()
    createProduct(@Body() createProductDto: CreateProductDto): Promise<any> {
        return this.productService.create(createProductDto);        
    }
}
