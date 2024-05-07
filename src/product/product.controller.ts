import { Controller, Get } from '@nestjs/common';
import { get } from 'http';

@Controller('product')
export class ProductController {
    @Get()
    getProducts(): string {
        return 'All products';
    }
}
